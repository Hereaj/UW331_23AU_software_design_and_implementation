import * as assert from 'assert';
import { NW, NE, SW, SE, GREEN, ROUND, STRAIGHT, Square, Row, rnil, rcons, qnil, qcons, RED } from './quilt';
import { PatternA, PatternB, PatternC, PatternD, PatternE } from './patterns';


describe('patterns', function() {

  const nw_round_green: Square = {shape: ROUND, color: GREEN, corner: NW};
  const ne_round_green: Square = {shape: ROUND, color: GREEN, corner: NE};
  const sw_round_green: Square = {shape: ROUND, color: GREEN, corner: SW};
  const se_round_green: Square = {shape: ROUND, color: GREEN, corner: SE};
  const nw_straight_green: Square = {shape: STRAIGHT, color: GREEN, corner: NW};
  //const ne_straight_green: Square = {shape: STRAIGHT, color: GREEN, corner: NE};
  //const sw_straight_green: Square = {shape: STRAIGHT, color: GREEN, corner: SW};
  const se_straight_green: Square = {shape: STRAIGHT, color: GREEN, corner: SE};

  const nw_round_red: Square = {shape: ROUND, color: RED, corner: NW};
  const ne_round_red: Square = {shape: ROUND, color: RED, corner: NE};
  const sw_round_red: Square = {shape: ROUND, color: RED, corner: SW};
  const se_round_red: Square = {shape: ROUND, color: RED, corner: SE};
  const nw_straight_red: Square = {shape: STRAIGHT, color: RED, corner: NW};
  //const ne_straight_red: Square = {shape: STRAIGHT, color: RED, corner: NE};
  //const sw_straight_red: Square = {shape: STRAIGHT, color: RED, corner: SW};
  const se_straight_red: Square = {shape: STRAIGHT, color: RED, corner: SE};
  
  
  it('PatternA', function() {
    const row_green: Row = rcons(nw_round_green, rcons(nw_round_green, rnil));
    const row_red: Row = rcons(nw_round_red, rcons(nw_round_red, rnil));

    // Checking number of row < 0
    assert.throws(() => PatternA(-1, GREEN), Error);
    
    // Checking the case of RED type color
    assert.deepStrictEqual(PatternA(1, RED), qcons(row_red, qnil));
    assert.notDeepStrictEqual(PatternA(1, RED), qcons(row_green, qnil));

    // Checking the case of Color type as undefined
    assert.deepStrictEqual(PatternA(1, undefined), qcons(row_green, qnil));

    // 0-1-many heuristic, base case
    assert.deepStrictEqual(PatternA(0, GREEN), qnil);
    
    // 0-1-many herustic, 1 recursive call (only one case)
    assert.deepStrictEqual(PatternA(1, GREEN), qcons(row_green, qnil));
    
    // 0-1-many herustic, more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternA(2, GREEN), qcons(row_green, qcons(row_green, qnil)));
    
    // 0-1-many herustic, more than 1 recursive call (2nd) 
    assert.deepStrictEqual(PatternA(3, GREEN),
        qcons(row_green, qcons(row_green, qcons(row_green, qnil))));
    
    // 0-1-many herustic, more than 1 recursive call (3rd)        
    assert.deepStrictEqual(PatternA(4, GREEN),
        qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
  });

  it('PatternB', function() {
    const row_green: Row = rcons(se_straight_green, rcons(nw_straight_green, rnil));
    const row_red: Row = rcons(se_straight_red, rcons(nw_straight_red, rnil));
    
    // Checking number of row < 0
    assert.throws(() => PatternB(-1, GREEN), Error);
    
    // Checking the case of RED type color
    assert.deepStrictEqual(PatternB(1, RED), qcons(row_red, qnil));
    assert.notDeepStrictEqual(PatternB(1, RED), qcons(row_green, qnil));
    
    // Checking the case of Color type as undefined
    assert.deepStrictEqual(PatternB(1, undefined), qcons(row_green, qnil));

    // 0-1-many heuristic, base case
    assert.deepStrictEqual(PatternB(0, GREEN), qnil);
    
    // 0-1-many heuristic, 1 recursive call (only one case)
    assert.deepStrictEqual(PatternB(1, GREEN), qcons(row_green, qnil));
    
    // 0-1-many heuristic, more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternB(2, GREEN), qcons(row_green, qcons(row_green, qnil)));

    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternB(3, GREEN),
        qcons(row_green, qcons(row_green, qcons(row_green, qnil))));

    // 0-1-many heuristic, more than 1 recursive call (3rd)
    assert.deepStrictEqual(PatternB(4, GREEN),
        qcons(row_green, qcons(row_green, qcons(row_green, qcons(row_green, qnil)))));
  });

  it('PatternC', function() {
    const row_green_top: Row = rcons(ne_round_green, rcons(nw_round_green, rnil));
    const row_green_btm: Row = rcons(se_round_green, rcons(sw_round_green, rnil));
    const row_red_top: Row = rcons(ne_round_red, rcons(nw_round_red, rnil));
    const row_red_btm: Row = rcons(se_round_red, rcons(sw_round_red, rnil));

    // Checking the case of RED type color
    assert.deepStrictEqual(PatternC(2, RED), qcons(row_red_top, qcons(row_red_btm, qnil)));
    assert.notDeepStrictEqual(PatternC(2, RED), qcons(row_green_top, qcons(row_green_btm, qnil)));

    // Checking the case of Color type as undefined
    assert.deepStrictEqual(PatternC(2, undefined), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // Checking number of row < 0
    assert.throws(() => PatternC(-1, GREEN), Error);
    
    // Checking odd numbers
    assert.throws(() => PatternC(1, GREEN), Error);
    assert.throws(() => PatternC(3, GREEN), Error);
    
    // 0-1-many heuristic, base case (row === 0)
    assert.deepStrictEqual(PatternC(0, GREEN), qnil);

    // 0-1-many heuristic, 1 recursive call (only one case)
    assert.deepStrictEqual(PatternC(2, GREEN), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // 0-1-many heuristic, more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternC(4, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qnil)))));

    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternC(6, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qnil)))))));
  });

  it('PatternD', function() {
    const row_green_top: Row = rcons(se_round_green, rcons(sw_round_green, rnil));
    const row_green_btm: Row = rcons(ne_round_green, rcons(nw_round_green, rnil));
    const row_red_top: Row = rcons(se_round_red, rcons(sw_round_red, rnil));
    const row_red_btm: Row = rcons(ne_round_red, rcons(nw_round_red, rnil));

    // Checking the case of RED type color
    assert.deepStrictEqual(PatternD(2, RED), qcons(row_red_top, qcons(row_red_btm, qnil)));
    assert.notDeepStrictEqual(PatternD(2, RED), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // Checking number of row < 0
    assert.throws(() => PatternD(-1, GREEN), Error);
    
    // Checking odd numbers
    assert.throws(() => PatternD(1, GREEN), Error);
    assert.throws(() => PatternD(3, GREEN), Error);

    // Checking the case of Color type as undefined
    assert.deepStrictEqual(PatternD(2, undefined), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // 0-1-many heuristic, base case (row === 0)
    assert.deepStrictEqual(PatternD(0, GREEN), qnil);

    // 0-1-many heuristic, 1 recursive call (only one case)
    assert.deepStrictEqual(PatternD(2, GREEN), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // 0-1-many heuristic, more than 1 recursive call (1st)
    assert.deepStrictEqual(PatternD(4, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qnil)))));

    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(PatternD(6, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qnil)))))));
  });

  it('PatternE', function() {
    const row_green_top: Row = rcons(nw_straight_green, rcons(se_straight_green, rnil));
    const row_green_btm: Row = rcons(se_straight_green, rcons(nw_straight_green, rnil));
    const row_red_top: Row = rcons(nw_straight_red, rcons(se_straight_red, rnil));
    const row_red_btm: Row = rcons(se_straight_red, rcons(nw_straight_red, rnil));

    // Checking the case of RED type color
    assert.deepStrictEqual(PatternE(2, RED), qcons(row_red_top, qcons(row_red_btm, qnil)));
    assert.notDeepStrictEqual(PatternE(2, RED), qcons(row_green_top, qcons(row_green_btm, qnil)));

    // Checking the case of Color type as undefined
    assert.deepStrictEqual(PatternE(2, undefined), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // Checking number of row < 0
    assert.throws(() => PatternE(-1, GREEN), Error);

    // 0-1-many heuristic, base case 1 (row === 0)
    assert.deepStrictEqual(PatternE(0, GREEN), qnil);
   
    // 0-1-many heuristic, base case 2 (row === 1)
    assert.deepStrictEqual(PatternE(1, GREEN), qcons(row_green_top, qnil));
    
    // 0-1-many heuristic, 1 recursive call from (row === 0) (1st)
    assert.deepStrictEqual(PatternE(2, GREEN), qcons(row_green_top, qcons(row_green_btm, qnil)));
    
    // 0-1-many heuristic, 1 recursive call from (row === 1) (1st)
    assert.deepStrictEqual(PatternE(3, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qnil))));
    
    // 0-1-many heuristic, more than 1 recursive call from (row === 0) (2nd)
    assert.deepStrictEqual(PatternE(4, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qnil)))));
    
    // 0-1-many heuristic, more than 1 recursive call from (row === 1) (2nd)
    assert.deepStrictEqual(PatternE(5, GREEN),
        qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qcons(row_green_btm, qcons(row_green_top, qnil))))));
        
  });
 
});
