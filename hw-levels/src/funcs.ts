/** Calculates (incorrectly) the value (n-1)^2. */
export const quadratic3 = (n: number): number => {
  return (n - 1);
}

/** Calculates (incorrectly) the value |x|.  */
export const abs_value3 = (x: number): number => {
  if (x === 2) {
    return x;
  } else if (x === -2) {
    return -1 * x;
  }
}

/** Calculates (incorrectly) the value |x|.  */
export const abs_value4 = (x: number): number|undefined => {
  if(x > 0) {
    return x;
  } else if(x < 0) {
    return -x;
  }
}

/**
 * Returns the number of pairs we can get from n items, where n is a
 * non-negative integer.
 */
export const count_pairs = (n: number): number => {
  if (n === 0) {
    return n / 2;
  } else if (n % 2 === 0) {
    return count_pairs(n - 2) + 1;
  } else if (n % 2 === 1) {
    return count_pairs(n - 1) + count_pairs(n - 1);
  }
}

/**
 * Returns the number of pairs we can get from n items, where n is a
 * non-negative integer.
 */
export const count_pairs2 = (n: number): number => {
  if (n === 0) {
    return n / 2;
  } else if (n % 2 === 0) {
    return count_pairs2(n - 2) + 1;
  } else if (n % 2 === 1) {
    return count_pairs2(n -1) * count_pairs2(n-1);
  }
}


// TODO: add the definition of "u" here
/**
 * A function that returns a number based on the input object.
 *
 * @param input Records type.
 * @param b A boolean value.
 * @param n A integer value.
 * @returns positive n if b is true and negative n if b is false.
 */
export const u = (input: {b: boolean, n: number}): number => {
  if(input.n === 0) {
    return 0;
  } else if (input.b) {
    return input.n;
  } else {
    return -input.n;
  }
}

// TODO: add the definition of "v" here
/**
 * A function that returns a number based on the input object.
 *
 * @param input Union type of passing non-negative integer or tuple type.
 * @param input[0] - A boolean value.
 * @param input[1] - A non-negative integer value.
 * @returns itself if input is any non-negative integer.
 *          1 if input is tuple and input[1] is 0.
 *          input[1] if input is tuple and input[1] is non-zero value.
 */
export const v = (input: number | [boolean, number]): number => {
  if (typeof input == "number") {
    return input;
  } else if (input[1] === 0) {
    return 1;
  } else {
    return v(input[1]);
  }
}

// TODO: add the definition of "w" here
/**
 * A function that returns a number based on the input object.
 *
 * @param input - Tuple type which contains integer value, 
 *                and records type of b as boolean and n as integer value.
 * @param input[0] - Non-negative integer
 * @param input[1].b - A boolean value.
 * @param input[1].n - A integer value.
 * @returns Add input[0] and input[1].n if input[1].b is true,
 *          Substrate input[0] and input[1].n if input[1].b is false.
 */
export const w = (input: [number, {b: boolean, n: number}]): number => {
  if (input[1].b) {
    return input[0] + input[1].n;
  } else {
    return input[0] - input[1].n;
  }
}