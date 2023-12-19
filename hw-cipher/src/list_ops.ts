import { List, nil, len, cons} from './list';


/** Returns the last element in the given list. */
export const last = <A,>(L: List<A>): A => {
    if (L === nil) {
        throw new Error("empty list has no last element");
    } else if (L.tl === nil) {
        return L.hd;
    } else {
        return last(L.tl);
    }
};


/** Returns the prefix consting of the first n elements of L. */
export const prefix = <A,>(n: number, L: List<A>): List<A> => {
  const length = len(L);
  if (n < 0 || n > length) {
    throw new Error("n should be more than 0 and less the length of list.");
  } else if (n === 0 || L === nil) {
    return nil;
  } else {
    return cons(L.hd, prefix(n - 1, L.tl));
  }
};


/** Returns the suffix consting of the elements of L after the first n. */
export const suffix = <A,>(n: number, L: List<A>): List<A> => {
  const length = len(L);
  if (n < 0 || n > length) {
    throw new Error("n should be more than 0 and less than or equal to the length of the list.");
  } else if (n === 0 || L === nil){
    return L;
  } else {
    return suffix(n -1, L.tl);
  }
};
