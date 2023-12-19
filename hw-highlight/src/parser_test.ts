import * as assert from 'assert';
import { explode } from './char_list';
import { explode_array, nil } from './list';
import { findHighlights, getNextHighlight, parseHighlightLines, parseHighlightText } from './parser';


describe('parser', function() {

  it('parseHighlightLines', function() {
    assert.deepEqual(parseHighlightLines(""), explode_array([]));
    assert.deepEqual(
      parseHighlightLines("Red hi there"),
      explode_array([
        {color: 'red', text: 'hi there'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text\nBlue really? more?"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
        {color: 'blue', text: 'really? more?'},
      ]));
  });

  it('getNextHighlight', function() {
    // first branch
    assert.strictEqual(getNextHighlight(explode("")), undefined);

    // second branch
    assert.strictEqual(getNextHighlight(explode("ab")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc")), undefined);

    // third branch
    assert.strictEqual(getNextHighlight(explode("ab[red")), undefined);
    assert.strictEqual(getNextHighlight(explode("[red")), undefined);

    // fourth branch
    assert.strictEqual(getNextHighlight(explode("abc[red|")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc[red|def")), undefined);

    // fifth branch
    assert.deepStrictEqual(getNextHighlight(explode("my [red|ball] is great")),
        ["my ", {color: "red", text: "ball"}, explode(" is great")]);
    assert.deepStrictEqual(getNextHighlight(explode("my [red|ball]")),
        ["my ", {color: "red", text: "ball"}, nil]);
    assert.deepStrictEqual(getNextHighlight(explode("grass is [green|itchy]")),
        ["grass is ", {color: "green", text: "itchy"}, explode("")]);
    assert.deepStrictEqual(getNextHighlight(explode("[green|itchy]")),
        ["", {color: "green", text: "itchy"}, explode("")]);
    
  });

  it('findHighlights', function() {
    assert.deepStrictEqual(findHighlights(explode("my [red|ball] is great")),
        explode_array([{color: 'white', text: 'my '}, {color: 'red', text: 'ball'}, {color: 'white', text: ' is great'}]));
    assert.deepStrictEqual(findHighlights(explode("my [red|ball]")),
        explode_array([{color: 'white', text: 'my '}, {color: 'red', text: 'ball'}]));
    assert.deepStrictEqual(findHighlights(explode("grass is [green|itchy]")),
        explode_array([{color: 'white', text: 'grass is '}, {color: 'green', text: 'itchy'}]));
    assert.deepStrictEqual(findHighlights(explode("[green|itchy]")),
        explode_array([{color: 'green', text: 'itchy'}]));
  });


  it('parseHighlightText', function() {
    assert.deepEqual(parseHighlightText(""), explode_array([]));
    assert.deepEqual(
      parseHighlightText("my [red|favorite] book"),
   explode_array([
      {color: 'white', text: 'my '},
        {color: 'red', text: 'favorite'},
        {color: 'white', text: ' book'},
      ]));
  });

});
