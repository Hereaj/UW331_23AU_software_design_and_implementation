import { List, nil, split, len } from "./list";
import { ColorInfo, COLORS } from "./colors";
import { ColorNode, empty, node } from "./color_node";
import { ColorList, findMatchingNamesIn } from "./color_list";

/**
 * @param L list of ColorInfo type
 * @return Binery Search Tree of ColorNode type
 */
export const makeBst = (L: List<ColorInfo>): ColorNode => {
  if (L === nil) {
    return empty;
  }

  const leng = Math.floor(len(L) / 2);
  const [front, back] = split(leng, L);

  if (back === nil) {
    return node(L.hd, empty, empty);
  } else {
    const root_node = back.hd;
    const left_tree = front;
    const right_tree = back.tl;

    return node(root_node, makeBst(left_tree), makeBst(right_tree));
  }
};

/**
 * @param y The name of the color which we want to search,
 * @oaram root Binary search tree containing color informations
 * @return Binery Search Tree of ColorNode type
 */
export const lookup = (y: string, root: ColorNode): ColorInfo | undefined => {
  if (root === empty) return undefined;

  const lower_y = y.toLowerCase();
  const root_color = root.info[0].toLowerCase();

  if (lower_y === root_color) return root.info;
  else if (lower_y > root_color) return lookup(y, root.after);
  else return lookup(y, root.before);
};

//TODO: add interfaces, classes, functions here
class ColorTree implements ColorList {
  // AF : obj = (colors)
  // RI : this.tree = makeBst(this.colors);
  colors: List<ColorInfo>;
  tree: ColorNode;

  constructor(colors: List<ColorInfo>) {
    this.colors = colors;
    this.tree = makeBst(colors);
  }

  /**
   * Returns a list of all color names that include the given text
   * @param text Text to look for in the names of the colors (case insensitive)
   * @returns list of all color names that include the given text
   */
  findMatchingNames = (text: string): List<string> => {
    return findMatchingNamesIn(text, this.colors);
  };

  /**
   * Returns the background and foreground CSS colors to highlight with this color.
   * @param name Name of the color to look for
   * @throws Error if there is no such color
   * @returns (bg, fg) where bg is the CSS background color and fg is foreground
   */
  getColorCss = (name: string): readonly [string, string] => {
   const colorInfo = lookup(name, this.tree);
   if (!colorInfo) {
     throw new Error("Color not found.");
   }

   const background = colorInfo[1];
   const foreground = colorInfo[2];

   return [background, foreground ? '#F0F0F0' : '#101010'];
 };
}

/**
 *
 * @returns tree(obj)
 */
export const makeColorTree = (): ColorTree => {
  return new ColorTree(COLORS);
};
