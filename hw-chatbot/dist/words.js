"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinWords = exports.wordsContain = exports.splitWords = exports.replaceWords = exports.substitute = void 0;
var DEBUG = true; // turn this to 'false' later if you want to prevent
// the CheckInv functions from executing. For this project you don't need to change it
// to false, but in a bigger program we might want to turn it off after debugging is
// complete, to avoid running expensive invariant checks when the project is released.
/**
 * Substitutes the element of string from the given array
 * with corresponding value in the given map
 * @param words an array of string
 * @param reps a map stored keys and values of corresponding keys
 * @modifiers words
 * @effects words = substitute(words, reps)
 */
var substitute = function (words, reps) {
    // TODO: (part 1b) implement this
    var j = 0;
    // Inv: words = substitute(words_0[0 .. j - 1], reps) ++ words_0[j .. n - 1] and n = words.length
    while (j !== words.length) {
        var exchange = reps.get(words[j]);
        if (exchange !== undefined) {
            words[j] = exchange;
        }
        j = j + 1;
    }
};
exports.substitute = substitute;
/**
 * Returns the list of words that results when each of the words in the given
 * map is replaced by its value, which can be multiple words.
 * @param words initial list of words
 * @param replacements map from strings to their replacements
 * @returns join(map(words, replacement)),
 *     where map(nil, reps) = nil
 *           map(cons(w, L), reps)) = reps.get(w) if w in reps
 *                                  = [w]         if w not in reps
 *     where join([]) = []
 *           join(L @ []) = join(L)
 *           join(L @ [S @ [w]]) = join(L @ S) @ [w]
 */
var replaceWords = function (words, replacements) {
    var replaced = [];
    var i = 0;
    // Inv: replaced[0..i-1] = map(words[0..i-1], replacements) and
    //      replaced[i..n-1] is unchanged
    while (i !== words.length) {
        var val = replacements.get(words[i]);
        if (val !== undefined) {
            replaced.push(val);
        }
        else {
            replaced.push([words[i]]);
        }
        i = i + 1;
    }
    var result = [];
    var j = 0;
    // Inv: result = join(replaced[0..j-1])
    while (j !== replaced.length) {
        var L = replaced[j];
        var k = 0;
        // Inv: result = join(replaced[0..j-1]) @ L[0..k-1]
        while (k !== L.length) {
            result.push(L[k]);
            k = k + 1;
        }
        j = j + 1;
    }
    return result;
};
exports.replaceWords = replaceWords;
// String containing all punctuation characters.
var PUNCT = ",.?;:!";
// Determines whether ch is a punctuation character.
var isPunct = function (ch) {
    if (ch.length !== 1)
        throw new Error("expecting a single character not \"".concat(ch, "\""));
    return PUNCT.indexOf(ch) >= 0;
};
/**
 * Breaks the given string into a sequence of words, separated by spaces or
 * punctuation. Spaces are not included in the result. Punctuation is included
 * as its own word.
 * @param str the string in question
 * @return an array of strings words such that
 *     1. join(words) = del-spaces(str), i.e., the concatenation of all the
 *        words is str but with all whitespace removed
 *     2. adjacent letters in the original string are in the same word
 *     3. no word includes any whitespace
 *     4. each word is either a single punctuation character or 1+ letters
 */
var splitWords = function (str) {
    var splits = [0]; // TODO (part a): fix this
    var j = 0; // TODO (part a): fix this
    CheckInv1(splits, str, j);
    // Inv: 1. 0 = splits[0] < splits[1] < ... < splits[n-1] = j
    //      2. for i = 0 .. n-1, if splits[i+1] - splits[i] > 1, then 
    //         str[splits[i] ..  splits[i+1]-1] is all letters
    //      3. for i = 1 .. n-1, splits[i] is not between two letters
    //  where n = splits.length
    while (j !== str.length) { // TODO (part 5a): fix this
        // TODO (part 5a): implement this
        splits.pop();
        if (j === 0) {
            splits.push(j);
        }
        if (j > 0) {
            if (str[j] === " " || isPunct(str[j])) {
                splits.push(j);
            }
            else if (str[j - 1] === " " || isPunct(str[j - 1])) {
                splits.push(j);
            }
        }
        j = j + 1;
        splits.push(j);
        CheckInv1(splits, str, j);
    }
    var words = [];
    var i = 0;
    CheckInv2(words, splits, str, i);
    // Inv: 1. join(words) = del-space(s[0..splits[i]-1]))
    //      2. no element of words contains any whitespace
    while (i + 1 !== splits.length) {
        if (str[splits[i]] !== " ")
            words.push(str.substring(splits[i], splits[i + 1]));
        i = i + 1;
        CheckInv2(words, splits, str, i);
    }
    // Post: join(words) = del-space(str), each punctuation is its own word,
    //       adjacent letters are in the same word, and no word has spaces
    return words;
};
exports.splitWords = splitWords;
// Verify that the invariant from the first loop of splitWords holds.
var CheckInv1 = function (splits, str, j) {
    if (!DEBUG)
        return; // skip this
    if (splits.length === 0 || splits[0] !== 0)
        throw new Error('splits should start with 0');
    if (splits[splits.length - 1] !== j)
        throw new Error("splits should end with the string's length ".concat(j));
    var n = splits.length - 1;
    // Inv: checked the invariant for splits[0 .. i-1]
    for (var i = 0; i < n; i++) {
        if (splits[i + 1] - splits[i] <= 0)
            throw new Error("should have at least 1 char between splits at ".concat(splits[i], " and ").concat(splits[i + 1]));
        var w = str.substring(splits[i], splits[i + 1]);
        if (w.length > 1) {
            // Inv: w[0 .. j-1] is all letters
            for (var j_1 = 0; j_1 < w.length; j_1++) {
                if (w[j_1] === " " || isPunct(w[j_1]))
                    throw new Error("space/punct \"".concat(w[j_1], "\" is in a part with other characters"));
            }
        }
        if (i > 0) {
            var c1 = str[splits[i] - 1];
            var c2 = str[splits[i]];
            if ((c1 !== " ") && !isPunct(c1) && (c2 !== " ") && !isPunct(c2))
                throw new Error("split at ".concat(splits[i], " is between two letters \"").concat(c1, "\" and \"").concat(c2, "\""));
        }
    }
};
// Verify that the invariant from the second loop of splitWords holds.
var CheckInv2 = function (words, splits, str, i) {
    if (!DEBUG)
        return; // skip this
    var s1 = words.join("");
    if (s1.indexOf(" ") >= 0)
        throw new Error("words contains space charactrs: \"".concat(s1, "\""));
    var s2 = str.slice(0, splits[i]);
    // Inv: s2 = str[0..splits[i]-1] with some spaces removed
    while (s2.indexOf(" ") >= 0)
        s2 = s2.replace(" ", "");
    if (s1 !== s2)
        throw new Error("words do not match the string (minus spaces): \"".concat(s1, "\" vs \"").concat(s2, "\""));
};
/**
 * Finds where the words of "sub" appear as a sub-array within "all".
 * @param all full list of words
 * @param sub non-empty list of words to search for in all
 * @returns an index j <= all.length - sub.length such that
 *     lower(all[j+i]) = lower(sub[i]) for i = 0 .. sub.length - 1
 *     or -1 if none exists
 */
var wordsContain = function (all, sub) {
    if (sub.length === 0)
        throw new Error("second list of words cannot be empty");
    if (all.length < sub.length)
        return -1; // not enough words to contain sub
    var k = -1;
    // Inv: no index 0 <= j <= k such that
    //      lower(all[j+i]) = lower(sub[i]) for i = 0 .. sub.length-1
    while (k + sub.length !== all.length) {
        k = k + 1;
        var m = 0;
        // Inv: outer Inv and lower(all[k+i]) = lower(sub[i]) for i = 0 .. m-1
        while (m !== sub.length && all[k + m].toLowerCase() === sub[m].toLowerCase()) {
            m = m + 1;
        }
        if (m === sub.length) {
            // all[k+i] = sub[i] for i = 0 .. sub.length-1
            return k; // j = k matches
        }
    }
    // Post: no index 0 <= j <= all.length - sub.length such that
    //       all[j+i] = sub[i] for i = 0 .. sub.length-1
    return -1;
};
exports.wordsContain = wordsContain;
/**
 * Returns a string containing all of the given words, in the same order, but
 * with spaces before each (non-punctuation) word other than the first.
 * @param words list of words (no spaces, punctuation as its own words)
 * @return join-words(words), where
 *     join-words([]) = ""
 *     join-words([w]) = w
 *     join-words(L @ [v, w]) =
 *         join-words(L @ [v]) + w        if w is punctuation
 *         join-words(L @ [v]) + " " + w  if w is not punctuation
 */
var joinWords = function (words) {
    // TODO (part 4a): handle the case when the array is empty
    var n = words.length;
    if (n === 0) {
        return "";
    }
    // TODO (part 4b): write a loop for the case when the array is not empty
    var parts = [words[0]];
    var j = 1;
    // Inv: join(parts) = join-words(words[0 .. j-1])
    while (j !== n) {
        var word = words[j];
        // check word.length since isPunct(word) returns error where word != 1
        if (word.length > 1 || !isPunct(word)) {
            parts.push(" ");
        }
        parts.push(word);
        j = j + 1;
    }
    return parts.join("");
};
exports.joinWords = joinWords;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29yZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvd29yZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBTSxLQUFLLEdBQVksSUFBSSxDQUFDLENBQUUsb0RBQW9EO0FBQ2xGLHNGQUFzRjtBQUN0RixvRkFBb0Y7QUFDcEYsc0ZBQXNGO0FBRXRGOzs7Ozs7O0dBT0c7QUFDSSxJQUFNLFVBQVUsR0FBRyxVQUFDLEtBQWUsRUFBRSxJQUF5QjtJQUNuRSxpQ0FBaUM7SUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRVYsaUdBQWlHO0lBQ2pHLE9BQU8sQ0FBQyxLQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDekIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztTQUN2QjtRQUVELENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1g7QUFDSCxDQUFDLENBQUM7QUFiVyxRQUFBLFVBQVUsY0FhckI7QUFFRjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSSxJQUFNLFlBQVksR0FDckIsVUFBQyxLQUE0QixFQUM1QixZQUFnRDtJQUVuRCxJQUFNLFFBQVEsR0FBNEIsRUFBRSxDQUFDO0lBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVWLCtEQUErRDtJQUMvRCxxQ0FBcUM7SUFDckMsT0FBTyxDQUFDLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUN6QixJQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFD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