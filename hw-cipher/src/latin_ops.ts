import { explode, compact } from './char_list';
import { List, nil, cons, concat } from './list';

/** Determines whether the given character is a vowel. */
const is_latin_vowel = (c: number): boolean => {
    const ch = String.fromCharCode(c).toLowerCase();
    return "aeiouy".indexOf(ch) >= 0;
};

/** Determines whether the given character is a Latin consonant. */
const is_latin_consonant = (c: number): boolean => {
    const ch = String.fromCharCode(c).toLowerCase();
    return "bcdfghjklmnpqrstvwxz".indexOf(ch) >= 0;
};

/** Changes most Latin alphabetic characters to different ones. */
export const next_latin_char = (c: number): number => {
    switch (String.fromCharCode(c)) {
        case "a": return "e".charCodeAt(0);
        case "e": return "i".charCodeAt(0);
        case "i": return "o".charCodeAt(0);
        case "o": return "u".charCodeAt(0);
        case "u": return "y".charCodeAt(0);
        case "y": return "a".charCodeAt(0);

        case "b": return "p".charCodeAt(0);
        case "p": return "j".charCodeAt(0);
        case "j": return "g".charCodeAt(0);
        case "g": return "d".charCodeAt(0);
        case "d": return "t".charCodeAt(0);
        case "t": return "b".charCodeAt(0);

        case "c": return "k".charCodeAt(0);
        case "k": return "s".charCodeAt(0);
        case "s": return "z".charCodeAt(0);
        case "z": return "c".charCodeAt(0);

        case "f": return "v".charCodeAt(0);
        case "v": return "w".charCodeAt(0);
        case "w": return "f".charCodeAt(0);

        case "h": return "l".charCodeAt(0);
        case "l": return "r".charCodeAt(0);
        case "r": return "h".charCodeAt(0);

        case "m": return "n".charCodeAt(0);
        case "n": return "m".charCodeAt(0);

        case "q": return "x".charCodeAt(0);
        case "x": return "q".charCodeAt(0);

        default: return c;
    }
};

/** Inverse of next_char. */
export const prev_latin_char = (c: number): number => {
    switch (String.fromCharCode(c)) {
        case "a": return "y".charCodeAt(0);
        case "e": return "a".charCodeAt(0);
        case "i": return "e".charCodeAt(0);
        case "o": return "i".charCodeAt(0);
        case "u": return "o".charCodeAt(0);
        case "y": return "u".charCodeAt(0);

        case "b": return "t".charCodeAt(0);
        case "p": return "b".charCodeAt(0);
        case "j": return "p".charCodeAt(0);
        case "g": return "j".charCodeAt(0);
        case "d": return "g".charCodeAt(0);
        case "t": return "d".charCodeAt(0);

        case "c": return "z".charCodeAt(0);
        case "k": return "c".charCodeAt(0);
        case "s": return "k".charCodeAt(0);
        case "z": return "s".charCodeAt(0);

        case "f": return "w".charCodeAt(0);
        case "v": return "f".charCodeAt(0);
        case "w": return "v".charCodeAt(0);

        case "h": return "r".charCodeAt(0);
        case "l": return "h".charCodeAt(0);
        case "r": return "l".charCodeAt(0);

        case "m": return "n".charCodeAt(0);
        case "n": return "m".charCodeAt(0);

        case "q": return "x".charCodeAt(0);
        case "x": return "q".charCodeAt(0);

        default: return c;
    }
};

// Note: count_consonants() and AY are provided to help you implement
// pig_latin_encode and pig_latin_decode

/** Returns the number of consonants at the start of the given string */
export const count_consonants = (L: List<number>): number|undefined => {
    if (L === nil) {
        return undefined;
    } else if (is_latin_vowel(L.hd)) {
        return 0;
    } else if (is_latin_consonant(L.hd)) {
        const n = count_consonants(L.tl);
        if (n === undefined) {
            return undefined;
        } else {
            return n + 1;
        }
    } else {
        return undefined;
    }
};

// TODO: uncomment to use
// List containing the character codes for the string "AY".
// const AY: List<number> = cons("a".charCodeAt(0), cons("y".charCodeAt(0), nil));


// TODO: add your function declarations in this file for: 
// cipher_encode, cipher_decode crazy_caps_encode, crazy_caps_decode,
// pig_latin_encode, pig_latin_decode

/**
 * Encrypts a list of numbers using a cipher algorithm.
 * @param L - A linked list of numbers to be encrypted.
 * @returns A new linked list of encrypted numbers.
 */
export const cipher_encode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    } else {
        return cons(next_latin_char(L.hd), cipher_encode(L.tl));
    }
};

/**
 * decrypts a list of numbers using a cipher algorithm.
 * @param L - A linked list of numbers to be decrypted.
 * @returns A new linked list of decrypted numbers.
 */
export const cipher_decode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    } else {
        return cons(prev_latin_char(L.hd), cipher_decode(L.tl));
    }
};

/**
 * Encodes a linked list of lowercase letters into a linked list of their corresponding uppercase ASCII values.
 * @param L - A linked list of lowercase letter codes (e.g., ASCII values of lowercase letters).
 * @require L contains only lowercase letter codes.
 * @returns A new linked list containing the uppercase ASCII values of the input letters.
 */
export const crazy_caps_encode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    } else if (L.tl === nil) {
        return cons(String.fromCharCode(L.hd).toUpperCase().charCodeAt(0), nil);
    } else {
        return cons(String.fromCharCode(L.hd).toUpperCase().charCodeAt(0), cons(L.tl.hd, crazy_caps_encode(L.tl.tl)));
    }
};

/**
 * Decodes a linked list of uppercase ASCII values previously encoded by crazy_caps_encode.
 * @param L - A linked list of uppercase ASCII values.
 * @require L === crazy_caps_encode(L);
 * @returns A new linked list containing the lowercase letter codes corresponding to the input values.
 */
export const crazy_caps_decode = (L: List<number>): List<number> => {
    if (L === nil) {
        return nil;
    } else if (L.tl === nil) {
        return cons(String.fromCharCode(L.hd).toLowerCase().charCodeAt(0), nil);
    } else {
        return cons(String.fromCharCode(L.hd).toLowerCase().charCodeAt(0), cons(L.tl.hd, crazy_caps_decode(L.tl.tl)));
    }
};

/**
 * Encodes a list of character codes into Pig Latin.
 * @param L - A list of character codes to be encoded into Pig Latin.
 * @require L === crazy_caps_encode(L); // Ensures that the input list has already been processed by the "crazy_caps_encode" function.
 * @returns A new list of character codes representing the input encoded in Pig Latin.
 */
export const pig_latin_encode = (L: List<number>): List<number> => {
    const cn = count_consonants(L);
    if (L === nil) {
        return nil;
    }
    if (cn === undefined) {
        return L;
    } else if (cn === 0){
        return concat(L, explode('way'));
    } else  {
        const input_string = compact(L);
        const is_last_q = input_string.charAt(cn-1) === "q";
        const is_first_u= input_string.charAt(cn) === "u";
        const is_after_u = (cn + 1 >= input_string.length) || is_latin_vowel(input_string.charCodeAt(cn + 1));
        const qu_index = (is_last_q && is_first_u && is_after_u)? cn + 1 : cn;
        const qu_result = input_string.substring (qu_index) + input_string.substring(0, qu_index) + "ay"
        return explode(qu_result);
    }
};

/**
 * Decodes a list of character codes from Pig Latin to the original string.
 * @param L - A list of character codes representing text encoded in Pig Latin.
 * @returns A new list of character codes representing the original text before Pig Latin encoding.
 */
export const pig_latin_decode = (L: List<number>): List<number> => {
    const input_string = compact(L);

    if (!input_string.match(".+ay$")) {
        return L;
    }

    if (input_string.match(".+quay$")) {
        const no_quay_in_string = input_string.substring(0, input_string.length - 4);
        const original_string_with_quay = no_quay_in_string.split("").reverse().join("");
        const cc_original_quay = count_consonants(explode(original_string_with_quay));
        const split_quay = input_string.length - 4 - ((cc_original_quay === undefined) ? 0 : cc_original_quay);
        const decode_quay = input_string.substring(split_quay, input_string.length-4) + "qu" + input_string.substring(0, split_quay);

        return explode(decode_quay);
    }

    const no_quay_in_string = input_string.substring(0, input_string.length -2);
    const flip_ay = no_quay_in_string.split("").reverse().join("");
    const cc_original_ay = count_consonants(explode(flip_ay));

    if (cc_original_ay === 0 || cc_original_ay === undefined) {
        return L;
    }

    if (input_string.match(".+way$") && is_latin_vowel(input_string.charCodeAt(input_string.length - 4))) {
        return explode(input_string.substring(0, input_string.length - 3));
    }

    const split_input = input_string.length - cc_original_ay - 2;
    const decode_result = input_string.substring(split_input, input_string.length - 2) + input_string.substring(0, split_input);

    return explode(decode_result);
};