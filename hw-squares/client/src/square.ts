import { List, nil } from './list';


export type Color = "white" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

/** Converts a string to a color (or throws an exception if not a color). */
export const toColor = (s: string): Color => {
  switch (s) {
    case "white": case "red": case "orange": case "yellow":
    case "green": case "blue": case "purple":
      return s;

    default:
      throw new Error(`unknown color "${s}"`);
  }
};

export type Square =
    | {readonly kind: "solid", readonly color: Color}
    | {readonly kind: "split", readonly nw: Square, readonly ne: Square,
       readonly sw: Square, readonly se: Square};

/** Returns a solid square of the given color. */
export const solid = (color: Color): Square => {
  return {kind: "solid", color: color};
};

/** Returns a square that splits into the four given parts. */
export const split =
    (nw: Square, ne: Square, sw: Square, se: Square): Square => {
  return {kind: "split", nw: nw, ne: ne, sw: sw, se: se};
};


export type Dir = "NW" | "NE" | "SE" | "SW";

/** Describes how to get to a square from the root of the tree. */
export type Path = List<Dir>;

/**
 * Retrieve the root of the subtree at that location.
 * @param sq the given square argument
 * @param paths the list of directions
 * @error If direction is not NW | NE | SW | SE, or if square is soild type
 * @returns the root node of the given square
 */
export const find = (sq: Square, paths: Path): Square => {
  if (paths === nil) {
    return sq;
  } else {
    const pathHead = paths.hd;
    const pathTail = paths.tl;

    if (sq.kind === "solid") {
      throw new Error("Invalid path for solid square. I cannot go further.");
    } else {
      switch(pathHead) {
        case "NW":
          return find(sq.nw, pathTail);
        case "NE":
          return find(sq.ne, pathTail);
        case "SW":
          return find(sq.sw, pathTail);
        case "SE":
          return find(sq.se, pathTail);
        
        default:
          throw new Error(`Invalid direction ${pathHead}`);
      }
    }
  }
}

/**
 * Modify the original square tree with new square node.
 * @param sq the given square argument
 * @param paths the list of directions
 * @param newSq the square node we want to replace.
 * @error If direction is not NW | NE | SW | SE, or if square is soild type
 * @returns tree of square with replaced node.
 */
export const replace = (sq: Square, paths: Path, newSq: Square): Square => {
  if (paths === nil) {
    return newSq;
  } else {
    const pathHead = paths.hd;
    const pathTail = paths.tl;

    if (sq.kind === "solid") {
      throw new Error("Invalid path for solid square");
    } else {
      switch(pathHead) {
        case "NW":
          return split(replace(sq.nw, pathTail, newSq), sq.ne, sq.sw, sq.se);
        case "NE":
          return split(sq.nw, replace(sq.ne, pathTail, newSq), sq.sw, sq.se);
        case "SW":
          return split(sq.nw, sq.ne, replace(sq.sw, pathTail, newSq), sq.se);
        case "SE":
          return split(sq.nw, sq.ne, sq.sw, replace(sq.se, pathTail, newSq));
        
        default:
          throw new Error(`Invalid direction ${pathHead}`);
      }
    }
  }
}

/** Returns JSON describing the given Square. */
export const toJson = (sq: Square): unknown => {
  if (sq.kind === "solid") {
    return sq.color;
  } else {
    return [toJson(sq.nw), toJson(sq.ne), toJson(sq.sw), toJson(sq.se)];
  }
};

/** Converts a JSON description to the Square it describes. */
export const fromJson = (data: unknown): Square => {
  if (typeof data === 'string') {
    return solid(toColor(data))
  } else if (Array.isArray(data)) {
    if (data.length === 4) {
      return split(fromJson(data[0]), fromJson(data[1]),
                   fromJson(data[2]), fromJson(data[3]));
    } else {
      throw new Error('split must have 4 parts');
    }
  } else {
    throw new Error(`type ${typeof data} is not a valid square`);
  }
}
