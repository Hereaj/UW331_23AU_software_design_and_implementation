"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assemble = exports.applyPattern = exports.matchPattern = exports.chatResponse = void 0;
var words_1 = require("./words");
// List of replacements to make in the input words.
var INPUT_REPLACEMENTS = new Map([
    ["dont", ["don't"]],
    ["cant", ["can't"]],
    ["wont", ["won't"]],
    ["recollect", ["remember"]],
    ["dreamt", ["dreamed"]],
    ["dreams", ["dream"]],
    ["maybe", ["perhaps"]],
    ["how", ["what"]],
    ["when", ["what"]],
    ["certainly", ["yes"]],
    ["machine", ["computer"]],
    ["computers", ["computer"]],
    ["were", ["was"]],
    ["you're", ["you", "are"]],
    ["i'm", ["i", "am"]],
    ["same", ["alike"]],
]);
// List of replacements to make in the output words.
var OUTPUT_REPLACEMENTS = new Map([
    ["am", ["are"]],
    ["your", ["my"]],
    ["me", ["you"]],
    ["myself", ["yourself"]],
    ["yourself", ["myself"]],
    ["i", ["you"]],
    ["you", ["I"]],
    ["my", ["your"]],
    ["i'm", ["you", "are"]],
]);
// Pattern to use if nothing above matches.
var DEFAULT_PATTERN = {
    name: ".none",
    contains: [],
    responses: [
        ["I'm", "not", "sure", "I", "understand", "you", "fully", "."],
        ["Please", "go", "on", "."],
        ["What", "does", "that", "suggest", "to", "you", "?"],
        ["Do", "you", "feel", "strongly", "about", "discussing", "such", "things", "?"]
    ]
};
/**
 * Returns the next response from the chatbot.
 * @param words words in the user's message
 * @param lastUsed map from name to the last response used for that word.
 *     (This is kept so that we can avoid reusing them as much as possible.)
 * @param patterns set of word patterns to use
 * @modifies lastUsed, memory
 * @returns words of the response
 */
var chatResponse = function (words, lastUsed, memory, patterns) {
    var e_1, _a, e_2, _b;
    // Start by making the substitutions listed above.
    words = (0, words_1.replaceWords)(words, INPUT_REPLACEMENTS);
    try {
        // Try the patterns in the order they appear. Use the first* that matches.
        // Use the next unused reponse for the matching pattern.
        // * The one exception to this is "my", which is instead pushed to memory.
        for (var patterns_1 = __values(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
            var pat = patterns_1_1.value;
            var args = (0, exports.matchPattern)(words, pat.contains);
            if (args !== undefined) {
                var out_args = [];
                try {
                    for (var args_1 = (e_2 = void 0, __values(args)), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                        var arg = args_1_1.value;
                        out_args.push((0, words_1.replaceWords)(arg, OUTPUT_REPLACEMENTS));
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (args_1_1 && !args_1_1.done && (_b = args_1.return)) _b.call(args_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var result_1 = (0, exports.applyPattern)(pat, args, lastUsed);
                if (pat.name === "my") {
                    memory.push(result_1);
                }
                else {
                    return result_1;
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // If we have something saved to memory, then pop and return it. Otherwise,
    // we just make up a default response.
    var result = memory.pop();
    if (result !== undefined) {
        return result;
    }
    else {
        return (0, exports.applyPattern)(DEFAULT_PATTERN, [], lastUsed);
    }
};
exports.chatResponse = chatResponse;
/**
 * Returns the arguments from the given words if those words match the given
 * pattern and undefined if not. (See WordPattern above for more info.)
 * @param words words to check against the pattern
 * @param contains list of 1, 2, or 3 sequences of words to look for (in order)
 * @returns the text before, between, and after the required words of the
 *     pattern if they appear and undefined if not
 */
var matchPattern = function (words, contains) {
    if (contains.length < 1 || 3 < contains.length)
        throw new Error("".concat(contains.length, " required word sequences not allowed"));
    var index1 = (0, words_1.wordsContain)(words, contains[0]);
    if (index1 < 0)
        return undefined;
    var arg1 = words.slice(0, index1);
    var words2 = words.slice(index1 + contains[0].length);
    if (contains.length === 1)
        return [arg1, words2];
    var index2 = (0, words_1.wordsContain)(words2, contains[1]);
    if (index2 < 0)
        return undefined;
    var arg2 = words2.slice(0, index2);
    var words3 = words2.slice(index2 + contains[1].length);
    if (contains.length === 2)
        return [arg1, arg2, words3];
    var index3 = (0, words_1.wordsContain)(words3, contains[2]);
    if (index3 < 0)
        return undefined;
    var arg3 = words3.slice(0, index3);
    var words4 = words3.slice(index3 + contains[2].length);
    return [arg1, arg2, arg3, words4];
};
exports.matchPattern = matchPattern;
/**
 * Returns the next response applied to the given pattern
 * @param pat pattern that matches
 * @param args arguments from matching the pattern
 * @param lastUsed (see chatResponse)
 * @modifies lastUsed changes the entry for this pattern to indicate which
 *    response was used
 * @returns result of substituting the arguments into the next unused response
 */
var applyPattern = function (pat, args, lastUsed) {
    var last = lastUsed.get(pat.name);
    var result = [];
    if (last !== undefined) {
        var next = (last + 1) % pat.responses.length;
        result = (0, exports.assemble)(pat.responses[next], args);
        lastUsed.set(pat.name, next);
    }
    else {
        result = (0, exports.assemble)(pat.responses[0], args);
        lastUsed.set(pat.name, 0);
    }
    return result;
};
exports.applyPattern = applyPattern;
/**
 * Returns the result of substituting, for each number in parts, the argument at
 * the corresponding index of args.
 * @param parts mix of words and numbers that indicate arguments to substitute
 * @param args values to substitute for numbers in parts
 * @returns sub(parts, args), where
 *     sub([], args) = []
 *     sub(L @ [w], args) = sub(L) @ [w]         if w is a word
 *     sub(L @ [n], args) = sub(L) @ args[n]     if n is a number
 */
var assemble = function (parts, args) {
    var e_3, _a;
    var words = [];
    var j = 0;
    // Inv: words = sub(parts[0..j-1], args)
    while (j != parts.length) {
        var part = parts[j];
        if (typeof part === 'number') {
            if (part < 0 || args.length <= part)
                throw new Error("no argument for part ".concat(part, " (only ").concat(parts.length, " args)"));
            try {
                for (var _b = (e_3 = void 0, __values(args[part])), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var word = _c.value;
                    words.push(word);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        else {
            words.push(part);
        }
        j = j + 1;
    }
    return words;
};
exports.assemble = assemble;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdGJvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGF0Ym90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBQXFEO0FBSXJELG1EQUFtRDtBQUNuRCxJQUFNLGtCQUFrQixHQUEwQixJQUFJLEdBQUcsQ0FBQztJQUN0RCxDQUFDLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNCLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQixDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RCLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQixDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzQixDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDcEIsQ0FBQyxDQUFDO0FBR0wsb0RBQW9EO0FBQ3BELElBQU0sbUJB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