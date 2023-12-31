/**
 * Returns the multiple of five closest to but not more than n.
 * @param n non-negative number
 * @returns m such that 5m <= n < 5(m+1)
 */
export const multOfFive = (n: number): number => {
  let m: number = 0; 
  // Inv: 5*m = n_0 - n and n >= 0
  while (n >= 5) {
    m = m + 1;
    n = n - 5;
  }
  return m;
};

/** Variation of multipleOfFive that fails for n >= 10 */
export const multOfFive10 = (n: number): number => {
  let m: number = 0; 
  // Inv: 5*m = n_0 - n and n >= 0
  while (n >= 5) {
    m = 1;        // TODO: change this
    n = n - 5;
  }
  return m;
};

/** Variation of multipleOfFive that fails for n=5 but passes 0, 4, 8, and 12 */
export const multOfFive5 = (n: number): number => {
  let m: number = 0; 
  // Inv: 5*m = n_0 - n and n >= 0
  while (n > 5) {    // TODO: change this
    m = m + 1;
    n = n - 5;
  }
  return m;
};

/** Variation of multipleOfFive that fails for n = 0 but passes 4, 8, and 12 */
export const multOfFive0 = (n: number): number => {
  let m: number = -1;  // TODO: change this
  // Inv: 5*m = n_0 - n and n >= 0
  while (n >= 2) {    // TODO: change this
    m = m + 1;
    n = n - 5;
  }
  return m;
};
