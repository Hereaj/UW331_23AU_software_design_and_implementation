import React from "react";
import {
  cipher_encode,
  cipher_decode,
  crazy_caps_encode,
  crazy_caps_decode,
  pig_latin_encode,
  pig_latin_decode,
} from "./latin_ops";
import { explode, compact } from "./char_list";

/** Returns UI that displays a form asking for encode/decode input. */
export const ShowForm = (_: {}): JSX.Element => {
  return (
      <form action="/" method="get">
          <input type="text" id="word" name="word"></input>
          <select id="algo" name="algo">
              <option value="cipher">Cipher</option>
              <option value="crazy-caps">Crazy Caps</option>
              <option value="pig-latin">Pig Latin</option>
          </select>
          <label><input type="radio" id="encode" name="op" value="encode"></input>Encode</label>
          <label><input type="radio" id="decode" name="op" value="decode"></input>Decode</label>
          <input type="submit" value="Submit"></input>
      </form>
  );
};

/** Properties expected for the ShowResult UI below. */
export type ShowResultProps = {
  word: string;
  algo: "cipher" | "crazy-caps" | "pig-latin";
  op: "encode" | "decode";
};

/**
 * Returns UI that shows the result of applying the specified operation to the
 * given word.
 */
export const ShowResult = (props: ShowResultProps): JSX.Element => {
  const word = props.word;
  const algo = props.algo;
  const op = props.op;

  const algorithms = {
    "cipher": { encode: cipher_encode, decode: cipher_decode },
    "crazy-caps": { encode: crazy_caps_encode, decode: crazy_caps_decode },
    "pig-latin": { encode: pig_latin_encode, decode: pig_latin_decode },
  };

  const selectedAlgorithm = algorithms[algo];
  // Check if the selected algorithm and operation exist, and apply them
  if (selectedAlgorithm && selectedAlgorithm[op]) {
    const result = selectedAlgorithm[op](explode(word));
    // Display the result inside a <code> tag within a <p> tag
    return (
      <p>
        <code>{compact(result)}</code>
      </p>
    );
  } else {
    // If the selected algorithm or operation doesn't exist, display the original word
    return (
      <p>
        <code>{word}</code>
      </p>
    );
  }
};
