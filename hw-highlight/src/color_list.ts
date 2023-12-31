import { ColorInfo, COLORS } from './colors';
import { List, cons, nil } from './list';

// TODO: add interfaces and classes here
export interface ColorList {

  /**
   * 
   * @param text Text to look for in the names of the colors
   * @returns list(obj.n)
   */
  findMatchingNames: (text: string) => List<string>;

  /**
   * 
   * @param name Name of the color to look for
   * @returns (obj.c, obj.w)
   */
  getColorCss: (name: string) => readonly [string, string];
}

class SimpleColorList implements ColorList {

  // AF : obj = (colors)
  colors: List<ColorInfo>;

  constructor(colors: List<ColorInfo>) {
    this.colors = colors;
  }


/**
 * Returns a list of all color names that include the given text
 * @param text Text to look for in the names of the colors (case insensitive)
 * @returns list of all color names that include the given text
 */
  findMatchingNames = (text: string) : List<string> => {
    return findMatchingNamesIn(text, this.colors);
  }

  /**
   * Returns the background and foreground CSS colors to highlight with this color.
   * @param name Name of the color to look for
   * @throws Error if there is no such color
   * @returns (bg, fg) where bg is the CSS background color and fg is foreground
   */
  getColorCss = (name: string) : readonly [string, string] => {
    return getColorCssIn(name, this.colors);
  }
}

/**
 * @returns list(obj)
 */
export const makeSimpleColorList = () : SimpleColorList => {
  const newList :SimpleColorList = new SimpleColorList(COLORS);
  return newList;
}

/**  
 * @param text The text in question
 * @param colors The full list of colors
 * @returns The sublist of colors containing those colors whose names contain the given text. 
 */
export const findMatchingNamesIn =
    (text: string, colors: List<ColorInfo>): List<string> => {
  if (colors === nil) {
    return nil;
  } else {
    // Note: the _ prevents the typechecker froom complaining about  
    // our defining these variables and not using them which we must
    // do to avoid tuple indexing
    const [color, _css, _foreground] = colors.hd;
    if (color.includes(text)) {
      return cons(color, findMatchingNamesIn(text, colors.tl));
    } else {
      return findMatchingNamesIn(text, colors.tl);
    }
  }
};

/** Returns the colors from the (first) list entry with this color name. Throws
* an Error none is found (i.e., we hit the end of the list).
* @param name The name in question.
* @param colors The full list of colors.
* @throws Error if no item in colors has the given name.
* @return The first item in colors whose name matches the given name. 
*/
const getColorCssIn =
    (name: string, colors: List<ColorInfo>): readonly [string, string] => {
  if (colors === nil) {
    throw new Error(`no color called "${name}"`);
  } else {
    const [color, css, foreground] = colors.hd;
    if (color === name) {
      return [css, foreground ? '#F0F0F0' : '#101010'];
    } else {
      return getColorCssIn(name, colors.tl);
    }
  }
};
