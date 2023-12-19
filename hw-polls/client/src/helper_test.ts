import * as assert from 'assert';
import { stringToArray } from './helper';

describe ('hepler', function() {

    it ('stringToArray', function() {

        // the case any empty string pass
        assert.deepStrictEqual(stringToArray(""), []);
        assert.deepStrictEqual(stringToArray(" "), []);
        assert.deepStrictEqual(stringToArray("  "), []);

        // the case without empty string, store 1 line as 1 element of array
        assert.deepStrictEqual(stringToArray("abc"), ["abc"]);
        assert.deepStrictEqual(stringToArray("abc dfg"), ["abc dfg"]);
        assert.deepStrictEqual(stringToArray("abc\nabc\ndfg"), ["abc", "dfg"]);
        assert.deepStrictEqual(stringToArray("abc\ndfg"), ["abc", "dfg"]);
        assert.deepStrictEqual(stringToArray("dinner\nlunch\nbreakfirst"), ["dinner", "lunch", "breakfirst"]);
        // read space around string
        assert.deepStrictEqual(stringToArray("dinner \n lunch\n breakfirst "), ["dinner ", " lunch", " breakfirst "]);

        // the case input mixing with line containing words and empty string
        assert.deepStrictEqual(stringToArray("abc\ndfg\n  \nefg"), ["abc", "dfg", "efg"]);
        assert.deepStrictEqual(stringToArray("abc\n  \ndfg\n   \n \nefg"), ["abc", "dfg", "efg"]);
        assert.deepStrictEqual(stringToArray("abc\ndfg\n  \nefg"), ["abc", "dfg", "efg"]);
        assert.deepStrictEqual(stringToArray("abc\ndfg\n  \nefg\n \nhij"), ["abc", "dfg", "efg", "hij"]);

        // the case with duplicated text line
        assert.deepStrictEqual(stringToArray("dinner\ndinner\nlunch\nbreakfirst\nlunch"), ["dinner", "lunch", "breakfirst"]);
        assert.deepStrictEqual(stringToArray("abc\nabc\n\ndfg"), ["abc", "dfg"]);
    });
});