import * as assert from 'assert';
import { nil, cons } from './list';
import { explode } from './char_list';
import { last, prefix, suffix} from './list_ops';


describe('list_ops', function() {

  it('last', function() {
    // Error case branch
    assert.throws(() => last(nil), Error);

    // 0-1-many: base case
    assert.deepEqual(last(explode("a")), "a".charCodeAt(0));
    assert.deepEqual(last(explode("_")), "_".charCodeAt(0));

    // 0-1-many: one recursive call
    assert.deepEqual(last(explode("hm")), "m".charCodeAt(0));
    assert.deepEqual(last(explode("hu")), "u".charCodeAt(0));

    // 0-1-many: many recursive calls
    assert.deepEqual(last(explode("hub")), "b".charCodeAt(0));
    assert.deepEqual(last(explode("stray")), "y".charCodeAt(0));
    assert.deepEqual(last(explode("shrug")), "g".charCodeAt(0));
  });

  it('prefix', function() {
    // Error case branch
    assert.throws(() => prefix(-1, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), Error);
    assert.throws(() => prefix(6, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), Error);
    assert.throws(() => prefix(6, nil), Error);

    // 0-1-many: base case
    assert.deepEqual(prefix(0, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), nil);
    assert.deepEqual(prefix(0, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), nil);

    // 0-1-many: one recursive call
    assert.deepEqual(prefix(1, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(1, nil));
    assert.deepEqual(prefix(1, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(5, nil));

    // 0-1-many: many recursive calls
    assert.deepEqual(prefix(2, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(1, cons(2, nil)));
    assert.deepEqual(prefix(2, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(5, cons(4, nil)));
    assert.deepEqual(prefix(3, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(1, cons(2, cons(3, nil))));
    assert.deepEqual(prefix(3, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(5, cons(4, cons(3, nil))));

  });

  it('suffix', function() {
    // Error case branch
    assert.throws(() => suffix(-1, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), Error);
    assert.throws(() => suffix(6, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), Error);
    assert.throws(() => suffix(6, nil), Error);

    // 0-1-many: base case
    assert.deepEqual(suffix(0, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(1, cons(2, cons(3, cons(4, cons(5, nil))))));
    assert.deepEqual(suffix(0, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(5, cons(4, cons(3, cons(2, cons(1, nil))))));

    // 0-1-many: one recursive call
    assert.deepEqual(suffix(1, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(2, cons(3, cons(4, cons(5, nil)))));
    assert.deepEqual(suffix(1, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(4, cons(3, cons(2, cons(1, nil)))));

    // 0-1-many: many recursive calls
    assert.deepEqual(suffix(2, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(3, cons(4, cons(5, nil))));
    assert.deepEqual(suffix(2, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(3, cons(2, cons(1, nil))));
    assert.deepEqual(suffix(3, cons(1, cons(2, cons(3, cons(4, cons(5, nil)))))), cons(4, cons(5, nil)));
    assert.deepEqual(suffix(3, cons(5, cons(4, cons(3, cons(2, cons(1, nil)))))), cons(2, cons(1, nil)));
  });

});
