import * as assert from 'assert';
import { solid, split, toJson, fromJson, find, replace } from './square';
import { cons, nil } from './list';


describe('square', function() {

  it('toJson', function() {
    assert.deepEqual(toJson(solid("white")), "white");
    assert.deepEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("red"));
    assert.deepEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "red"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepEqual(fromJson("white"), solid("white"));
    assert.deepEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "red"]),
        split(s1, solid("green"), s1, solid("red")));

    assert.deepEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

  it('find', function() {

    // solid type
    const testSquareSolid = solid("blue");

    // split types
    const testSquareSplit = split(solid("blue"), solid("green"), solid("blue"), solid("orange"));
    const testSquareSplitToNW = split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("purple"), solid("red"), solid("purple"));
    const testSquareSplitToNE = split(solid("blue"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("red"), solid("purple"));
    const testSquareSplitToSW = split(solid("blue"), solid("green"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("purple"));
    const testSquareSplitToSE = split(solid("blue"), solid("green"), solid("red"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")));
    const testSquareSplit3times = split(split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                        split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                              split(solid("purple"), solid("white"), solid("purple"), solid("red"))),
                                        split(split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                              split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                        split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white"))));
    
    // Error case of no-matched path
    // with single solid node
    assert.throws(() => find(testSquareSolid, cons("NW", nil)), Error);
    // with "extra" path with solid node
    assert.throws(() => find(testSquareSolid, cons("NW", cons("NE", nil))), Error);
    // with "extra" path with split node
    assert.throws(() => find(testSquareSplit, cons("NW", cons("NE", cons("SE", nil)))), Error);
    assert.throws(() => find(testSquareSplitToNE, cons("NW", cons("NE", cons("SE", nil)))), Error);

    // Case that path is nil
    assert.deepEqual(find(testSquareSolid, nil), solid("blue"));

    // Case of splits (only 1 root node)
    // where path start NW
    assert.deepEqual(find(testSquareSplit, cons("NW", nil)), solid("blue"));
    // where path start NE
    assert.deepEqual(find(testSquareSplit, cons("NE", nil)), solid("green"));
    // where path start SW
    assert.deepEqual(find(testSquareSplit, cons("SW", nil)), solid("blue"));
    // where path start SE
    assert.deepEqual(find(testSquareSplit, cons("SE", nil)), solid("orange"));

    // Case of splits (more than 1 root nodes)
    // where path start NW
    assert.deepEqual(find(testSquareSplitToNW, cons("NW", cons("NW", nil))), solid("blue"));
    // where path start NE
    assert.deepEqual(find(testSquareSplitToNE, cons("NE", cons("NE", nil))), solid("green"));
    // where path start SW
    assert.deepEqual(find(testSquareSplitToSW, cons("SW", cons("SW", nil))), solid("blue"));
    // where path start SE
    assert.deepEqual(find(testSquareSplitToSE, cons("SE", cons("SE", nil))), solid("orange"));

    // where path start NW
    assert.deepEqual(find(testSquareSplit3times, cons("NW", cons("SE", cons("SW", nil)))), solid("purple"));
    // where path start NE
    assert.deepEqual(find(testSquareSplit3times, cons("NE", cons("NE", cons("NE", nil)))), solid("orange"));
    // where path start SW
    assert.deepEqual(find(testSquareSplit3times, cons("SW", cons("NW", cons("NE", nil)))), solid("white"));
    // where path start SE
    assert.deepEqual(find(testSquareSplit3times, cons("SE", cons("SW", cons("SE", nil)))), solid("yellow"));

    // test for some other paths
    // where path start NW
    assert.deepEqual(find(testSquareSplitToNW, cons("NW", cons("SE", nil))), solid("orange"));
    // where path start NE
    assert.deepEqual(find(testSquareSplitToNE, cons("NE", cons("SW", nil))), solid("blue"));
    // where path start SW
    assert.deepEqual(find(testSquareSplitToSW, cons("SW", cons("NE", nil))), solid("green"));
    // where path start SE
    assert.deepEqual(find(testSquareSplitToSE, cons("SE", cons("NW", nil))), solid("blue"));


  })

  it('replace', function() {

    // solid type
    const testSquareSolid = solid("blue");

    // split types
    const testSquareSplit = split(solid("blue"), solid("green"), solid("blue"), solid("orange"));
    const testSquareSplitToNW = split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("purple"), solid("red"), solid("purple"));
    const testSquareSplitToNE = split(solid("blue"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("red"), solid("purple"));
    const testSquareSplitToSW = split(solid("blue"), solid("green"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("purple"));
    const testSquareSplitToSE = split(solid("blue"), solid("green"), solid("red"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")));
    const testSquareSplit3times = split(split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                        split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                              split(solid("purple"), solid("white"), solid("purple"), solid("red"))),
                                        split(split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                              split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                        split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                              split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                              split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                              split(solid("yellow"), solid("blue"), solid("yellow"), solid("white"))));
    

    // Error case of no-matched path
    // with single solid node
    assert.throws(() => replace(testSquareSolid, cons("NW", nil), solid("purple")), Error);
    // with "extra" path with solid node
    assert.throws(() => replace(testSquareSolid, cons("NW", cons("NE", nil)), solid("purple")), Error);
    // with "extra" path with split node
    assert.throws(() => replace(testSquareSplit, cons("NW", cons("NE", cons("SE", nil))), solid("purple")), Error);
    assert.throws(() => replace(testSquareSplitToNE, cons("NW", cons("NE", cons("SE", nil))), solid("purple")), Error);

    // Case that path is nil
    assert.deepEqual(replace(testSquareSolid, nil, solid("purple")), solid("purple"));

    // Case of splits (only 1 root node)
    // where path start NW
    assert.deepEqual(replace(testSquareSplit, cons("NW", nil), solid("purple")), split(solid("purple"), solid("green"), solid("blue"), solid("orange")));
    // where path start NE
    assert.deepEqual(replace(testSquareSplit, cons("NE", nil), solid("purple")), split(solid("blue"), solid("purple"), solid("blue"), solid("orange")));
    // where path start SW
    assert.deepEqual(replace(testSquareSplit, cons("SW", nil), solid("red")), split(solid("blue"), solid("green"), solid("red"), solid("orange")));
    // where path start SE
    assert.deepEqual(replace(testSquareSplit, cons("SE", nil), solid("white")), split(solid("blue"), solid("green"), solid("blue"), solid("white")));

    // Case of splits (more than 1 root nodes)
    // where path start NW
    assert.deepEqual(replace(testSquareSplitToNW, cons("NW", cons("NW", nil)), solid("purple")), split(split(solid("purple"), solid("green"), solid("blue"), solid("orange")), solid("purple"), solid("red"), solid("purple")));
    // where path start NE
    assert.deepEqual(replace(testSquareSplitToNE, cons("NE", cons("NE", nil)), solid("purple")), split(solid("blue"), split(solid("blue"), solid("purple"), solid("blue"), solid("orange")), solid("red"), solid("purple")));
    // where path start SW
    assert.deepEqual(replace(testSquareSplitToSW, cons("SW", cons("SW", nil)), solid("yellow")), split(solid("blue"), solid("green"), split(solid("blue"), solid("green"), solid("yellow"), solid("orange")),  solid("purple")));
    // where path start SE
    assert.deepEqual(replace(testSquareSplitToSE, cons("SE", cons("SE", nil)), solid("yellow")), split(solid("blue"), solid("green"), solid("red"), split(solid("blue"), solid("green"), solid("blue"), solid("yellow"))));

    // where path start NW
    assert.deepEqual(replace(testSquareSplit3times, cons("NW", cons("SE", cons("SW", nil))), solid("red")), split(split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("red"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red"))),
                                                                                                                  split(split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")))));
    // where path start NE
    assert.deepEqual(replace(testSquareSplit3times, cons("NE", cons("NE", cons("NE", nil))), solid("red")), split(split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("red"), solid("red"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red"))),
                                                                                                                  split(split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")))));
    // where path start SW
    assert.deepEqual(replace(testSquareSplit3times, cons("SW", cons("NW", cons("NE", nil))), solid("red")), split(split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red"))),
                                                                                                                  split(split(solid("purple"), solid("red"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")))));
    // where path start SE
    assert.deepEqual(replace(testSquareSplit3times, cons("SE", cons("SW", cons("SE", nil))), solid("red")), split(split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red"))),
                                                                                                                  split(split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("yellow"))),
                                                                                                                  split(split(solid("blue"), solid("green"), solid("blue"), solid("orange")), 
                                                                                                                        split(solid("purple"), solid("white"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("red"), solid("orange"), solid("purple"), solid("red")), 
                                                                                                                        split(solid("yellow"), solid("blue"), solid("yellow"), solid("white")))));

    // test for replacing new split
    assert.deepEqual(replace(testSquareSolid, nil, testSquareSplit), split(solid("blue"), solid("green"), solid("blue"), solid("orange")));
    assert.deepEqual(replace(testSquareSplit, cons("NE", nil), testSquareSplit), split(solid("blue"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("blue"), solid("orange")));
    assert.deepEqual(replace(testSquareSplitToSW, cons("SW", cons("NE", nil)), testSquareSplit), split(solid("blue"), solid("green"), split(solid("blue"), split(solid("blue"), solid("green"), solid("blue"), solid("orange")), solid("blue"), solid("orange")), solid("purple")));
  })
});
