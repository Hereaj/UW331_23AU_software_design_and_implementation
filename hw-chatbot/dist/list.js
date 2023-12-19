"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explode_array = exports.compact_list = exports.rev = exports.at = exports.concat = exports.equal = exports.len = exports.cons = exports.nil = void 0;
/** The empty list. */
exports.nil = "nil";
/** Returns a list with hd in front of tl. */
var cons = function (hd, tl) {
    return { kind: "cons", hd: hd, tl: tl };
};
exports.cons = cons;
/**
 * Returns the length of the list.
 * @param L list whose length should be returned
 * @returns 0 if L = nil else 1 + len(tail(L))
 */
var len = function (L) {
    if (L === exports.nil) {
        return 0;
    }
    else {
        return 1 + (0, exports.len)(L.tl);
    }
};
exports.len = len;
/**
 * Determines whether the two given lists are equal, using === to compare the
 * corresponding values in the lists.
 * @param L The first list to compare
 * @param R The second list to compare
 * @returns true iff the lists have the same length and the elements at the same
 *     indexes of the two lists have values that are ===.
 */
var equal = function (L, R) {
    if (L === exports.nil) {
        return R === exports.nil;
    }
    else if (R === exports.nil) {
        return false;
    }
    else if (L.hd !== R.hd) {
        return false;
    }
    else {
        return (0, exports.equal)(L.tl, R.tl);
    }
};
exports.equal = equal;
/**
 * Returns the a list consisting of L followed by R.
 * @param L list to go at the front of the result
 * @param R list to go at the end of the result
 * @returns A single list consisting of L's elements followed by R's
 */
var concat = function (L, R) {
    if (L === exports.nil) {
        return R;
    }
    else {
        return (0, exports.cons)(L.hd, (0, exports.concat)(L.tl, R));
    }
};
exports.concat = concat;
/**
 * Returns the element at index n in the list.
 * @param n an integer between 0 and len(L) - 1 inclusie
 * @returns L.hd if n is 0 else at(n - 1, L.tl)
 */
var at = function (n, L) {
    if (L === exports.nil) {
        throw new Error('no element at that index');
    }
    else if (n === 0) {
        return L.hd;
    }
    else {
        return (0, exports.at)(n - 1, L.tl);
    }
};
exports.at = at;
/**
 * Returns the reverse of the given list.
 * @param L list to revese
 * @returns list containing the same elements but in reverse order
 */
var rev = function (L) {
    if (L === exports.nil) {
        return exports.nil;
    }
    else {
        return (0, exports.concat)((0, exports.rev)(L.tl), (0, exports.cons)(L.hd, exports.nil));
    }
};
exports.rev = rev;
/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
var compact_list = function (L) {
    if (L === exports.nil) {
        return [];
    }
    else {
        return [L.hd].concat((0, exports.compact_list)(L.tl)); // NOTE: O(n^2)
    }
};
exports.compact_list = compact_list;
/**
 * Returns the elements in the given array as a list.
 * @param arr the array to turn into a list
 * @returns list containing the same elements as in arr in the same order
 */
var explode_array = function (arr) {
    if (arr.length === 0) {
        return exports.nil;
    }
    else {
        return (0, exports.cons)(arr[0], (0, exports.explode_array)(arr.slice(1))); // NOTE: O(n^2)
    }
};
exports.explode_array = explode_array;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLHNCQUFzQjtBQUNULFFBQUEsR0FBRyxHQUFVLEtBQUssQ0FBQztBQUVoQyw2Q0FBNkM7QUFDdEMsSUFBTSxJQUFJLEdBQUcsVUFBSyxFQUFLLEVBQUUsRUFBVztJQUN6QyxPQUFPLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUM7QUFGVyxRQUFBLElBQUksUUFFZjtBQUdGOzs7O0dBSUc7QUFDSSxJQUFNLEdBQUcsR0FBRyxVQUFLLENBQVU7SUFDaEMsSUFBSSxDQUFDLEtBQUssV0FBRyxFQUFFO1FBQ2IsT0FBTyxDQUFDLENBQUM7S0FDVjtTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQyxDQUFDO0FBTlcsUUFBQSxHQUFHLE9BTWQ7QUFFRjs7Ozs7OztHQU9HO0FBQ0ksSUFBTSxLQUFLLEdBQUcsVUFBSSxDQUFVLEVBQUUsQ0FBVTtJQUM3QyxJQUFJLENBQUMsS0FBSyxXQUFHLEVBQUU7UUFDYixPQUFPLENBQUMsS0FBSyxXQUFHLENBQUM7S0FDbEI7U0FBTSxJQUFJLENBQUMsS0FBSyxXQUFHLEVBQUU7UUFDcEIsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ3hCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7U0FBTTtRQUNMLE9BQU8sSUFBQSxhQUFLLEVBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDLENBQUM7QUFWVyxRQUFBLEtBQUssU0FVaEI7QUFFRjs7Ozs7R0FLRztBQUNJLElBQU0sTUFBTSxHQUFHLFVBQUssQ0FBVSxFQUFFLENBQVU7SUFDL0MsSUFBSSxDQUFDLEtBQUssV0FBRyxFQUFFO1FBQ2IsT0FBTyxDQUFDLENBQUM7S0FDVjtTQUFNO1FBQ0wsT0FBTyxJQUFBLFlBQUksRUFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUEsY0FBTSxFQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQztBQUNILENBQUMsQ0FBQztBQU5XLFFBQUEsTUFBTSxVQU1qQjtBQUVGOzs7O0dBSUc7QUFDSSxJQUFNLEVBQUUsR0FBRyxVQUFLLENBQVMsRUFBRSxDQUFVO0lBQzFDLElBQUksQ0FBQyxLQUFLLFdBQUcsRUFBRTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUM3QztTQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDYjtTQUFNO1FBQ0wsT0FBTyxJQUFBLFVBQUUsRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN4QjtBQUNILENBQUMsQ0FBQztBQVJXLFFBQUEsRUFBRSxNQVFiO0FBRUY7Ozs7R0FJRztBQUNJLElBQU0sR0FBRyxHQUFHLFVBQUksQ0FBVTtJQUMvQixJQUFJLENBQUMsS0FBSyxXQUFHLEVBQUU7UUFDYixPQUFPLFdBQUcsQ0FBQztLQUNaO1NBQU07UUFDTCxPQUFPLElBQUEsY0FBTSxFQUFDLElBQUEsV0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFBLFlBQUksRUFBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDM0M7QUFDSCxDQUFDLENBQUM7QUFOVyxRQUFBLEdBQUcsT0FNZDtBQUVGOzs7O0dBSUc7QUFDSSxJQUFNLFlBQVksR0FBRyxVQUFLLENBQVU7SUFDekMsSUFBSSxDQUFDLEtBQUssV0FBRyxFQUFFO1FBQ2IsT0FBTyxFQUFFLENBQUM7S0FDWDtTQUFNO1FBQ0wsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBQSxvQkFBWSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUUsZUFBZTtLQUMzRDtBQUNILENBQUMsQ0FBQztBQU5XLFFBQUEsWUFBWSxnQkFNdkI7QUFFRjs7OztHQUlHO0FBQ0ksSUFBTSxhQUFhLEdBQUcsVUFBSyxHQUFxQjtJQUNyRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sV0FBRyxDQUFDO0tBQ1o7U0FBTTtRQUNMLE9BQU8sSUFBQSxZQUFJLEVBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUEscUJBQWEsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLGVBQWU7S0FDbkU7QUFDSCxDQUFDLENBQUM7QUFOVyxRQUFBLGFBQWEsaUJBTXhCIn0=