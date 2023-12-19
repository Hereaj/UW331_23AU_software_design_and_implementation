import * as assert from 'assert';
import { empty, node, } from './color_node';
import { makeBst, lookup, makeColorTree } from './color_tree';
import { explode_array, cons, nil } from './list';

describe('color_tree', function() {
    it('make_bst', function() {
        // base case (when tree is empty)
        assert.deepEqual(makeBst(explode_array([])), empty);

        // recursive case (there is only 1 node)
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true]])), node(['blue', '#0000FF', true], empty, empty));
        
        // resursive case (there are more than 2 nodes)
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true], ['cyan', '#00FFFF', false]])), node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), empty));
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true], ['cyan', '#00FFFF', false], ['darkorange', '#FF8C00', true]])), node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), node(['darkorange', '#FF8C00', true], empty, empty)));
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true], ['cyan', '#00FFFF', false], ['darkorange', '#FF8C00', true], ['forestgreen', '#228B22', true]])), node(['darkorange', '#FF8C00', true], node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), empty), node(['forestgreen', '#228B22', true], empty, empty)));
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true], ['cyan', '#00FFFF', false], ['darkorange', '#FF8C00', true], ['forestgreen', '#228B22', true], ['gold', '#FFD700', false]])), node(['darkorange', '#FF8C00', true], node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), empty), node(['gold', '#FFD700', false], node(['forestgreen', '#228B22', true], empty, empty), empty)));
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true], ['cyan', '#00FFFF', false], ['darkorange', '#FF8C00', true], ['forestgreen', '#228B22', true], ['gold', '#FFD700', false], ['honeydew', '#F0FFF0', false]])), node(['forestgreen', '#228B22', true], node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), node(['darkorange', '#FF8C00', true], empty, empty)), node(['honeydew', '#F0FFF0', false], node(['gold', '#FFD700', false], empty, empty), empty)));
        assert.deepEqual(makeBst(explode_array([['blue', '#0000FF', true], ['cyan', '#00FFFF', false], ['darkorange', '#FF8C00', true], ['forestgreen', '#228B22', true], ['gold', '#FFD700', false], ['honeydew', '#F0FFF0', false], ['ivory', '#FFFFF0', false]])), node(['forestgreen', '#228B22', true], node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), node(['darkorange', '#FF8C00', true], empty, empty)), node(['honeydew', '#F0FFF0', false], node(['gold', '#FFD700', false], empty, empty), node(['ivory', '#FFFFF0', false], empty, empty))));
    });

    it('lookup', function() {
        // base case (when BST is empty)
        assert.deepEqual(lookup('blue' ,empty), undefined);

        // recursive case (y = root_color)
        assert.deepEqual(lookup('honeydew', node(['honeydew', '#F0FFF0', false], empty, empty)), ['honeydew', '#F0FFF0', false]);
        assert.deepEqual(lookup('honeydew', node(['honeydew', '#F0FFF0', false], node(['blue', '#0000FF', true], empty, empty), empty)), ['honeydew', '#F0FFF0', false]);
        assert.deepEqual(lookup('honeydew', node(['honeydew', '#F0FFF0', false], node(['blue', '#0000FF', true], empty, empty), empty)), ['honeydew', '#F0FFF0', false]);

        // recursive case (y > root_color)
        // node count 1
        assert.deepEqual(lookup('honeydew', node(['Yellow', '#FFFF00', false], empty, empty)), undefined);
        // node count 3 (thus lookup can check right node)
        assert.deepEqual(lookup('honeydew', node(['green', '#008000', true], node(['blue', '#0000FF', true], empty, empty), node(['honeydew', '#F0FFF0', false], empty, empty))), ['honeydew', '#F0FFF0', false]);
        // node count 7
        assert.deepEqual(lookup('honeydew', node(['forestgreen', '#228B22', true], node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), node(['darkorange', '#FF8C00', true], empty, empty)), node(['green', '#008000', true], node(['gold', '#FFD700', false], empty, empty), node(['honeydew', '#F0FFF0', false], empty, empty)))), ['honeydew', '#F0FFF0', false]);

        // recursive case (y < root_color)
        // node count 1
        assert.deepEqual(lookup('blue', node(['Yellow', '#FFFF00', false], empty, empty)), undefined);
        // node count 2 (only chech left node)
        assert.deepEqual(lookup('blue', node(['green', '#008000', true], node(['blue', '#0000FF', true], empty, empty), empty)), ['blue', '#0000FF', true]);
        // node count 3
        assert.deepEqual(lookup('blue', node(['green', '#008000', true], node(['blue', '#0000FF', true], empty, empty), node(['honeydew', '#F0FFF0', false], empty, empty))), ['blue', '#0000FF', true]);
        // node  count 7
        assert.deepEqual(lookup('blue', node(['forestgreen', '#228B22', true], node(['cyan', '#00FFFF', false], node(['blue', '#0000FF', true], empty, empty), node(['darkorange', '#FF8C00', true], empty, empty)), node(['green', '#008000', true], node(['gold', '#FFD700', false], empty, empty), node(['honeydew', '#F0FFF0', false], empty, empty)))),['blue', '#0000FF', true]);
        
    });

    const colors = makeColorTree();

    it('findMatchingNames', function() {

        assert.deepEqual(colors.findMatchingNames("doesnotexist"), nil);
        assert.deepEqual(colors.findMatchingNames("notacolor"), nil);
        assert.deepEqual(colors.findMatchingNames("indigo"), cons("indigo", nil));
        assert.deepEqual(colors.findMatchingNames("azure"), cons("azure", nil));
        assert.deepEqual(colors.findMatchingNames("lavender"),
            cons("lavender", cons("lavenderblush", nil)));
        assert.deepEqual(colors.findMatchingNames("pink"),
            cons("deeppink", cons("hotpink", cons("lightpink", cons("pink", nil)))));
      });
    
      it('getColorCss', function() {
        assert.deepEqual(colors.getColorCss("lavender"), ['#E6E6FA', '#101010']);
        assert.deepEqual(colors.getColorCss("indigo"), ['#4B0082', '#F0F0F0']);
      });
});