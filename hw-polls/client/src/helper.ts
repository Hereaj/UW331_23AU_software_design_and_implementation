/**
 * take input from the textbox and return string array without empty string.
 * @param str input string
 * @returns string[] 
 */
export const stringToArray = (str: string): string[] => {
    // Split the input string into an array using newline as the delimiter
    const inputString = str;
    const replaced = inputString.split("\n");

    // Use a Set to keep track of unique elements while filtering out empty strings
    const uniqueSet = new Set(replaced.filter((item) => item.trim() !== ""));

    // Convert the Set back to an array
    const result = Array.from(uniqueSet);

    return result;
}