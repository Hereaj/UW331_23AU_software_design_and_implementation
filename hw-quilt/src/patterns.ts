import {
  GREEN,
  Quilt,
  ROUND,
  STRAIGHT,
  Square,
  qnil,
  rnil,
  qcons,
  rcons,
  Row,
  NW,
  SE,
  NE,
  SW,
  Color,
  qconcat,
  rconcat,
} from "./quilt";

/** Returns a quilt in pattern "A". */
export const PatternA = (row: number, color: Color = GREEN): Quilt => {
  if (row < 0) {
    throw new Error("The number of rows must be a positive integer(inclusively zero).")
  }

  const squares: Square = {shape: ROUND, color: color, corner: NW};
  const rows: Row = {kind: "rcons", hd: squares, tl: {kind: "rcons", hd: squares, tl: rnil}};
  if (row === 0) {
    return qnil;
  } else if (row === 1) {
    return qcons(rows, qnil);
  } else {
    return qcons(rows, PatternA(row - 1, color));
  }
  
};

/** Returns a quilt in pattern "B". */
export const PatternB = (row: number, color: Color = GREEN): Quilt => {
  if (row < 0) {
    throw new Error("The number of rows must be a positive integer(inclusively zero).")
  }
  const squaresLeft: Square = {shape: STRAIGHT, color: color, corner: SE};
  const squaresRight: Square = {shape: STRAIGHT, color: color, corner: NW};
  const rows: Row = rconcat(rcons(squaresLeft, rnil), rcons(squaresRight, rnil));
  if (row === 0) {
    return qnil;
  } else if (row === 1) {
    return qconcat(qcons(rows, qnil), qnil);
  } else {
    return qcons(rows, PatternB(row - 1, color));
  }
};

/** Returns a quilt in pattern "C". */
export const PatternC = (row: number, color: Color = GREEN): Quilt => {
  if (row < 0 || row % 2 !== 0) {
    throw new Error("The number of rows must be even positive integers(inclusively zero).")
  }
  const squareTopLeft: Square = { shape: ROUND, color: color, corner: NE };
  const squareTopRight: Square = { shape: ROUND, color: color, corner: NW };
  const squareBottomLeft: Square = { shape: ROUND, color: color, corner: SE };
  const squareBottomRight: Square = { shape: ROUND, color: color, corner: SW };

  const rowsTop: Row = {kind: "rcons", hd: squareTopLeft, tl: {kind: "rcons", hd: squareTopRight, tl: rnil}};
  const rowsBottom: Row = {kind: "rcons", hd: squareBottomLeft, tl: {kind: "rcons", hd: squareBottomRight, tl: rnil}};

  if (row === 0) {
    return qnil;
  } else if (row === 2) {
    return qcons(rowsTop, qcons(rowsBottom, qnil));
  } else {
    return qcons(rowsTop, qcons(rowsBottom, PatternC(row - 2, color)));
  }
}; 

/** Returns a quilt in pattern "D". */
export const PatternD = (row: number, color: Color = GREEN): Quilt => {
  if (row < 0 || row % 2 !== 0) {
    throw new Error("The number of rows must be even positive integers(inclusively zero).")
  }
  const squareTopLeft: Square = { shape: ROUND, color: color, corner: SE };
  const squareTopRight: Square = { shape: ROUND, color: color, corner: SW };
  const squareBottomLeft: Square = { shape: ROUND, color: color, corner: NE };
  const squareBottomRight: Square = { shape: ROUND, color: color, corner: NW };

  const rowsTop: Row = {kind: "rcons", hd: squareTopLeft, tl: {kind: "rcons", hd: squareTopRight, tl: rnil}};
  const rowsBottom: Row = {kind: "rcons", hd: squareBottomLeft, tl: {kind: "rcons", hd: squareBottomRight, tl: rnil}};

  if (row === 0) {
    return qnil;
  } else if (row === 2) {
    return qcons(rowsTop, qcons(rowsBottom, qnil));
  } else {
    return qcons(rowsTop, qcons(rowsBottom, PatternD(row - 2, color)));
  }
};

/** Returns a quilt in pattern "E". */
export const PatternE = (row: number, color: Color = GREEN): Quilt => {
  if (row < 0) {
    throw new Error("The number of rows must be even positive integers except 1(inclusively zero).")
  }
  const squareTopLeft: Square = { shape: STRAIGHT, color: color, corner: NW };
  const squareTopRight: Square = { shape: STRAIGHT, color: color, corner: SE };
  const squareBottomLeft: Square = { shape: STRAIGHT, color: color, corner: SE };
  const squareBottomRight: Square = { shape: STRAIGHT, color: color, corner: NW };
  const rowTop: Row = {
    kind: "rcons",
    hd: squareTopLeft,
    tl: { kind: "rcons", hd: squareTopRight, tl: rnil },
  };
  const rowBottom: Row = {
    kind: "rcons",
    hd: squareBottomLeft,
    tl: { kind: "rcons", hd: squareBottomRight, tl: rnil },
  };

  if (row === 0) {
    return qnil;
  } else if (row === 1) {
    return qcons(rowTop, qnil);
  } else {
    return qcons(rowTop, qcons(rowBottom, PatternE(row - 2, color)));
  }
};
