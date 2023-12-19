import React from "react";
import * as assert from "assert";
import { ShowResult } from "./ui";

describe("ui", function () {
  it("ShowResult", function () {
    assert.deepEqual(
      ShowResult({ word: "cray", algo: "crazy-caps", op: "encode" }),
      <p>
        <code>CrAy</code>
      </p>
    );

    assert.deepEqual(
      ShowResult({ word: "CrAy", algo: "crazy-caps", op: "decode" }),
      <p>
        <code>cray</code>
      </p>
    );

    assert.deepEqual(
      ShowResult({ word: "shquay", algo: "pig-latin", op: "encode" }),
      <p>
        <code>ayshquay</code>
      </p>
    );

    assert.deepEqual(
      ShowResult({ word: "away", algo: "pig-latin", op: "decode" }),
      <p>
        <code>a</code>
      </p>
    );

    assert.deepEqual(
      ShowResult({ word: "aeio", algo: "cipher", op: "encode" }),
      <p>
        <code>eiou</code>
      </p>
    );

    assert.deepEqual(
      ShowResult({ word: "aeiu", algo: "cipher", op: "decode" }),
      <p>
        <code>yaeo</code>
      </p>
    );
  });
});
