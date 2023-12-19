import * as assert from 'assert';
import { NW, NE, SW, SE, GREEN, RED, ROUND, Square, Row, rnil, rcons, qnil, qcons, STRAIGHT } from './quilt';
import { sew, symmetrize, sflip_vert, rflip_vert, qflip_vert, sflip_horz, rflip_horz, qflip_horz } from './quilt_ops';

const nw_round_green: Square = {shape: ROUND, color: GREEN, corner: NW};
const ne_round_green: Square = {shape: ROUND, color: GREEN, corner: NE};
const sw_round_green: Square = {shape: ROUND, color: GREEN, corner: SW};
const se_round_green: Square = {shape: ROUND, color: GREEN, corner: SE};

const nw_straight_red: Square = {shape: STRAIGHT, color: RED, corner: NW};
const ne_straight_red: Square = {shape: STRAIGHT, color: RED, corner: NE};
const sw_straight_red: Square = {shape: STRAIGHT, color: RED, corner: SW};
const se_straight_red: Square = {shape: STRAIGHT, color: RED, corner: SE};

describe('quilt_ops', function() {

  it('sflip_vert', function() {
    // Case of NW in corner type -> SW
    assert.deepStrictEqual(sflip_vert(nw_round_green), sw_round_green);

    // Case of NE in corner type -> SE
    assert.deepStrictEqual(sflip_vert(ne_round_green), se_round_green);

    // Case of SW in corner type -> NW
    assert.deepStrictEqual(sflip_vert(sw_round_green), nw_round_green);

    // Case of SE in corner type -> NE
    assert.deepStrictEqual(sflip_vert(se_round_green), ne_round_green);
  });

  it('rflip_vert', function() {
    // 0-1-many heuristic, base case (case of row === rnil)
    assert.deepStrictEqual(rflip_vert(rnil), rnil);

    // 0-1-many heuristic, 1 recursive call (1st)
    assert.deepStrictEqual(rflip_vert(rcons(nw_round_green, rnil)), rcons(sw_round_green, rnil));

    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(rflip_vert(rcons(nw_round_green, rcons(sw_round_green, rnil))), rcons(sw_round_green, rcons(nw_round_green, rnil)));

    // 0-1-many heuristic, more than  recursive call (3rd)
    assert.deepStrictEqual(rflip_vert(rcons(nw_round_green, rcons(sw_round_green, rcons(ne_round_green, rnil)))), rcons(sw_round_green, rcons(nw_round_green, rcons(se_round_green, rnil))));
    
    // 0-1-many heuristic, more than  recursive call (4th)
    assert.deepStrictEqual(rflip_vert(rcons(nw_round_green, rcons(sw_round_green, rcons(ne_round_green, rcons(se_round_green, rnil))))), rcons(sw_round_green, rcons(nw_round_green, rcons(se_round_green, rcons(ne_round_green, rnil)))));
  });

  it('qflip_vert', function() {
    const test_case_ne_sw: Row = rcons(ne_straight_red, rcons(sw_straight_red, rnil));
    const test_case_se_nw: Row = rcons(se_straight_red, rcons(nw_straight_red, rnil));

    const test_case_sw_se: Row = rcons(sw_straight_red, rcons(se_straight_red, rnil));
    const test_case_nw_ne: Row = rcons(nw_straight_red, rcons(ne_straight_red, rnil));

    const test_case_ne_se: Row = rcons(ne_straight_red, rcons(se_straight_red, rnil));
    const test_case_se_ne: Row = rcons(se_straight_red, rcons(ne_straight_red, rnil));

    // 0-1-many heuristic, base case (case of Quilt === qnil)
    assert.deepStrictEqual(qflip_vert(qnil), qnil);

    // 0-1-many heuristic, 1 recursive call (1st)
    assert.deepStrictEqual(qflip_vert(qcons(test_case_ne_sw, qcons(test_case_sw_se, qnil))), qcons(test_case_nw_ne, qcons(test_case_se_nw, qnil)));
    
    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(qflip_vert(qcons(test_case_ne_sw, qcons(test_case_sw_se, qcons(test_case_ne_se, qnil)))), qcons(test_case_se_ne, qcons(test_case_nw_ne, qcons(test_case_se_nw, qnil))));
    
    // 0-1-many heuristic, more than  recursive call (3rd)
    assert.deepStrictEqual(qflip_vert(qcons(test_case_ne_sw, qcons(test_case_sw_se, qcons(test_case_sw_se, qcons(test_case_ne_se, qnil))))), qcons(test_case_se_ne, qcons(test_case_nw_ne, qcons(test_case_nw_ne, qcons(test_case_se_nw, qnil)))));
  });

  it('sflip_horz', function() {
    // Case of NW in corner type -> NE
    assert.deepStrictEqual(sflip_horz(nw_round_green), ne_round_green);

    // Case of NE in corner type -> NW
    assert.deepStrictEqual(sflip_horz(ne_round_green), nw_round_green);

    // Case of SW in corner type -> SE
    assert.deepStrictEqual(sflip_horz(sw_round_green), se_round_green);

    // Case of SE in corner type -> SW
    assert.deepStrictEqual(sflip_horz(se_round_green), sw_round_green);
  });

  it('rflip_horz', function() {
    // 0-1-many heuristic, base case (case of row === rnil)
    assert.deepStrictEqual(rflip_horz(rnil), rnil);

    // 0-1-many heuristic, 1 recursive call (1st)
    assert.deepStrictEqual(rflip_horz(rcons(nw_round_green, rnil)), rcons(ne_round_green, rnil));

    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(rflip_horz(rcons(nw_round_green, rcons(sw_round_green, rnil))), rcons(se_round_green, rcons(ne_round_green, rnil)));
   
    // 0-1-many heuristic, more than  recursive call (3rd)
    assert.deepStrictEqual(rflip_horz(rcons(nw_round_green, rcons(sw_round_green, rcons(ne_round_green, rnil)))), rcons(nw_round_green, rcons(se_round_green, rcons(ne_round_green, rnil))));
    
    // 0-1-many heuristic, more than  recursive call (4th)
    assert.deepStrictEqual(rflip_horz(rcons(ne_round_green, rcons(sw_round_green, rcons(ne_round_green, rcons(se_round_green, rnil))))), rcons(sw_round_green, rcons(nw_round_green, rcons(se_round_green, rcons(nw_round_green, rnil)))));
  });

  it('qflip_horz', function() {
    const test_case_ne_sw_ne_se: Row = rcons(ne_straight_red, rcons(sw_straight_red, rcons(ne_straight_red, rcons(se_straight_red, rnil))));
    const test_case_sw_nw_se_nw: Row = rcons(sw_straight_red, rcons(nw_straight_red, rcons(se_straight_red, rcons(nw_straight_red, rnil))));
    
    const test_case_sw_sw_sw_ne: Row = rcons(sw_straight_red, rcons(sw_straight_red, rcons(sw_straight_red, rcons(ne_straight_red, rnil))));
    const test_case_nw_se_se_se: Row = rcons(nw_straight_red, rcons(se_straight_red, rcons(se_straight_red, rcons(se_straight_red, rnil))));
    
    const test_case_ne_nw_nw_ne: Row = rcons(ne_straight_red, rcons(nw_straight_red, rcons(nw_straight_red, rcons(ne_straight_red, rnil))));
    const test_case_nw_ne_ne_nw: Row = rcons(nw_straight_red, rcons(ne_straight_red, rcons(ne_straight_red, rcons(nw_straight_red, rnil))));

    // 0-1-many heuristic, base case (case of Quilt === qnil)
    assert.deepStrictEqual(qflip_vert(qnil), qnil);
    
    // 0-1-many heuristic, 1 recursive call (1st)
    assert.deepStrictEqual(qflip_horz(qcons(test_case_ne_sw_ne_se, qnil)), qcons(test_case_sw_nw_se_nw, qnil));
    
    // 0-1-many heuristic, more than 1 recursive call (2nd)
    assert.deepStrictEqual(qflip_horz(qcons(test_case_ne_sw_ne_se, qcons(test_case_sw_sw_sw_ne, qnil))), qcons(test_case_sw_nw_se_nw, qcons(test_case_nw_se_se_se, qnil)));
    
    // 0-1-many heuristic, more than  recursive call (3rd)
    assert.deepStrictEqual(qflip_horz(qcons(test_case_ne_sw_ne_se, qcons(test_case_sw_sw_sw_ne, qcons(test_case_ne_nw_nw_ne, qnil)))), qcons(test_case_sw_nw_se_nw, qcons(test_case_nw_se_se_se, qcons(test_case_nw_ne_ne_nw, qnil))));
  });

  const nw_sq: Square = {corner: NW, color: GREEN, shape: ROUND};
  const ne_sq: Square = {corner: NE, color: GREEN, shape: ROUND};
  const se_sq: Square = {corner: SE, color: GREEN, shape: ROUND};
  const sw_sq: Square = {corner: SW, color: GREEN, shape: ROUND};

  it('sew', function() {
    const r1 = rcons(nw_sq, rcons(ne_sq, rnil));
    const r12 = rcons(se_sq, rcons(sw_sq, rnil));
    const r2 = rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil))));
    const r22 = rcons(se_sq, rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rnil))));

    // invalid case: (qnil, !qnil)
    assert.throws(() => sew(qnil, qcons(r1, qnil)), Error);
    assert.throws(() => sew(qnil, qcons(r1, qcons(r1, qnil))), Error);

    // invalid case: (!qnil, qnil)
    assert.throws(() => sew(qcons(r1, qnil), qnil), Error);
    assert.throws(() => sew(qcons(r1, qcons(r1, qnil)), qnil), Error);

    // 0-1-many: base case
    assert.deepStrictEqual(sew(qnil, qnil), qnil);

    // 0-1-many: one recursive call
    assert.deepStrictEqual(sew(qcons(r1, qnil), qcons(r1, qnil)), qcons(r2, qnil));
    assert.deepStrictEqual(sew(qcons(r12, qnil), qcons(r12, qnil)), qcons(r22, qnil));

    // 0-1-many: many recursive calls
    assert.deepStrictEqual(
        sew(qcons(r1, qcons(r1, qnil)), qcons(r1, qcons(r1, qnil))),
        qcons(r2, qcons(r2, qnil)));
    assert.deepStrictEqual(
        sew(qcons(r12, qcons(r12, qcons(r12, qnil))), 
            qcons(r12, qcons(r12, qcons(r12, qnil)))),
        qcons(r22, qcons(r22, qcons(r22, qnil))));
  });

  it('symmetrize', function() {
    // 0-1-many: base case
    assert.deepStrictEqual(symmetrize(qnil), qnil);
    assert.deepStrictEqual(symmetrize(qcons(rcons(nw_sq, rnil), qnil)),
        qcons(rcons(nw_sq, rcons(ne_sq, rnil)),
            qcons(rcons(sw_sq, rcons(se_sq, rnil)), qnil)));

    // 0-1-many: one recursive call
    assert.deepStrictEqual(symmetrize(qcons(rcons(nw_sq, rnil), qnil)),
        qcons(rcons(nw_sq, rcons(ne_sq, rnil)),
            qcons(rcons(sw_sq, rcons(se_sq, rnil)), qnil)));
    assert.deepStrictEqual(symmetrize(qcons(rcons(se_sq, rnil), qnil)),
        qcons(rcons(se_sq, rcons(sw_sq, rnil)),
            qcons(rcons(ne_sq, rcons(nw_sq, rnil)), qnil)));

    // 0-1-many: many recursive calls
    const r1 = rcons(nw_sq, rcons(ne_sq, rnil));
    assert.deepStrictEqual(symmetrize(qcons(r1, qnil)),
        qcons(
            rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
            qcons(
                rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                qnil)));
    const r2 = rcons(sw_sq, rcons(se_sq, rnil));
    assert.deepStrictEqual(symmetrize(qcons(r1, qcons(r2, qnil))),
        qcons(
            rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
            qcons(
                rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                qcons(
                    rcons(nw_sq, rcons(ne_sq, rcons(nw_sq, rcons(ne_sq, rnil)))),
                    qcons(
                        rcons(sw_sq, rcons(se_sq, rcons(sw_sq, rcons(se_sq, rnil)))),
                        qnil)))));
  });

});
