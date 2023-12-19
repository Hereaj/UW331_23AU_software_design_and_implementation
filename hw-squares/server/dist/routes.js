"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetForTesting = exports.listFiles = exports.load = exports.save = void 0;
// Map from file name to item.
var files = new Map();
/**
 * Handle request for /save by storing the given name.
 * @param req the request
 * @param res the response
 */
var save = function (req, res) {
    var name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing.');
        return;
    }
    var value = req.body.value;
    if (value === undefined) {
        res.status(400).send('required argument "value" was missing.');
        return;
    }
    var hasValue = files.has(name);
    res.send({ replaced: hasValue });
    files.set(name, value);
};
exports.save = save;
/** Handles request for /load by returning the transcript requested. */
var load = function (req, res) {
    var name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('required argument "name" was missing.');
        return;
    }
    else if (!files.has(name)) {
        res.status(400).send("The given argument name - \"".concat(name, "\" does not have any values."));
        return;
    }
    res.send({ value: files.get(name) });
};
exports.load = load;
/**
 * Return a list of all files with the given name.
 * @param _req the request
 * @param res the response
 */
var listFiles = function (_req, res) {
    var e_1, _a;
    var fileLists = [];
    try {
        for (var _b = __values(files.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var file = _c.value;
            fileLists.push(file);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    res.send({ files: fileLists });
};
exports.listFiles = listFiles;
/** Used in tests to set the files map back to empty. */
var resetForTesting = function () {
    files.clear();
};
exports.resetForTesting = resetForTesting;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
var first = function (param) {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQVFBLDhCQUE4QjtBQUM5QixJQUFNLEtBQUssR0FBeUIsSUFBSSxHQUFHLEVBQW1CLENBQUM7QUFFL0Q7Ozs7R0FJRztBQUNJLElBQU0sSUFBSSxHQUFHLFVBQUMsR0FBZ0IsRUFBRSxHQUFpQjtJQUN0RCxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzQixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQ2xELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDOUQsT0FBTztLQUNSO0lBRUQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDN0IsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO1FBQ3ZCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUE7UUFDOUQsT0FBTztLQUNSO0lBRUQsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7SUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFBO0FBaEJZLFFBQUEsSUFBSSxRQWdCaEI7QUFFRCx1RUFBdUU7QUFDaEUsSUFBTSxJQUFJLEdBQUcsVUFBQyxHQUFnQixFQUFFLEdBQWlCO0lBQ3RELElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQzlELE9BQU87S0FDUjtTQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzNCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHNDQUE4QixJQUFJLGlDQUE2QixDQUFDLENBQUM7UUFDdEYsT0FBTztLQUNSO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUE7QUFYWSxRQUFBLElBQUksUUFXaEI7QUFFRDs7OztHQUlHO0FBQ0ksSUFBTSxTQUFTLEdBQUcsVUFBQyxJQUFpQixFQUFFLEdBQWlCOztJQUM1RCxJQUFNLFNBQVMsR0FBYSxFQUFFLENBQUM7O1FBRS9CLEtBQW1CLElBQUEsS0FBQSxTQUFBLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQSxnQkFBQSw0QkFBRTtZQUE1QixJQUFNLElBQUksV0FBQTtZQUNiLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7Ozs7Ozs7OztJQUVELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUE7QUFSWSxRQUFBLFNBQVMsYUFRckI7QUFFRCx3REFBd0Q7QUFDakQsSUFBTSxlQUFlLEdBQUc7SUFDN0IsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ2YsQ0FBQyxDQUFDO0FBRlcsUUFBQSxlQUFlLG1CQUUxQjtBQUVGLHdFQUF3RTtBQUN4RSw0RUFBNEU7QUFDNUUsbURBQW1EO0FBQ25ELElBQU0sS0FBSyxHQUFHLFVBQUMsS0FBYztJQUMzQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEI7U0FBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUNwQyxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU07UUFDTCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtBQUNILENBQUMsQ0FBQyJ9