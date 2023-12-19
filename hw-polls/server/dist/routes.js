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
exports.isRecord = exports.getPoll = exports.vote = exports.addPoll = exports.listPolls = exports.advanceTimeForTesting = exports.resetForTesting = void 0;
var polls = new Map();
/** Testing function to remove all the added polls. */
var resetForTesting = function () {
    polls.clear();
};
exports.resetForTesting = resetForTesting;
/** Testing function to move all end times forward the given amount (of ms). */
var advanceTimeForTesting = function (ms) {
    var e_1, _a;
    try {
        for (var _b = __values(polls.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var poll = _c.value;
            poll.endTime -= ms;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.advanceTimeForTesting = advanceTimeForTesting;
// Sort polls with the ones finishing soonest first, but with all those that
// are completed after those that are not and in reverse order by end time.
var comparePolls = function (a, b) {
    var now = Date.now();
    var endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
    var endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
    return endA - endB;
};
/**
 * Returns a list of all the polls, sorted so that the ongoing polls come
 * first, with the ones about to end listed first, and the completed ones after,
 * with the ones completed more recently
 * @param _req the request
 * @param res the response
 */
var listPolls = function (_req, res) {
    var vals = Array.from(polls.values());
    vals.sort(comparePolls);
    res.send({ polls: vals });
};
exports.listPolls = listPolls;
/**
 * Add the item to the list.
 * @param req the request
 * @param res the response
 */
var addPoll = function (req, res) {
    var name = req.body.name;
    if (typeof name !== 'string') {
        res.status(400).send("missing 'name' parameter");
        return;
    }
    var minutes = req.body.minutes;
    if (typeof minutes !== "number") {
        res.status(400).send("'minutes' is not a number: ".concat(minutes));
        return;
    }
    else if (isNaN(minutes) || minutes < 1 || Math.round(minutes) !== minutes) {
        res.status(400).send("'minutes' is not a positive integer: ".concat(minutes));
        return;
    }
    var options = req.body.options;
    if (!Array.isArray(options) || !options.every(isOptionRecord)) {
        res.status(400).send("'options' must be an array of records with string and number");
        return;
    }
    else if (options.length < 2) {
        res.status(400).send("The length of 'options' must be more than two items");
        return;
    }
    var total = req.body.total;
    if (typeof total !== "number" || isNaN(total)) {
        res.status(400).send("'total' must be an number or missing");
        return;
    }
    else if (Math.round(total) !== total || total < 0) {
        res.status(400).send("'total' is not a positive integer: ".concat(total));
        return;
    }
    // Make sure there is no poll with this name already.
    if (polls.has(name)) {
        res.status(400).send("poll for '".concat(name, "' already exists"));
        return;
    }
    var poll = {
        name: name,
        endTime: Date.now() + minutes * 60 * 1000,
        options: options,
        total: total,
    };
    polls.set(poll.name, poll); // add this to the map of polls
    res.send({ poll: poll }); // send the poll we made
};
exports.addPoll = addPoll;
/**
 * Add voter information for every matched poll
 * array of string, voters from indiviual element of picked is subset of voters.
 * @param req the request
 * @param res the response
 */
var vote = function (req, res) {
    var e_2, _a;
    var option = req.body.option;
    if (typeof option !== 'string') {
        res.status(400).send("missing 'voter' parameter");
        return;
    }
    var name = req.body.name;
    if (typeof name !== 'string') {
        res.status(400).send("missing 'name' parameter");
        return;
    }
    var poll = polls.get(name);
    if (poll === undefined) {
        res.status(400).send("no poll with name '".concat(name, "'"));
        return;
    }
    var now = Date.now();
    if (now >= poll.endTime) {
        res.status(400).send("auction for \"".concat(poll.name, "\" has already ended"));
        return;
    }
    if (!Array.isArray(poll.options) || !poll.options.every(isOptionRecord)) {
        res.status(400).send("'options' must be an array of records with string and number");
        return;
    }
    try {
        // query parameter "option" must be an element of poll.options
        for (var _b = __values(poll.options), _c = _b.next(); !_c.done; _c = _b.next()) {
            var item = _c.value;
            if (option === item.option) {
                item.voter = item.voter + 1;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    poll.total = poll.total + 1;
    res.send({ poll: poll }); // send back the updated poll state
};
exports.vote = vote;
/**
 * Retrieves the current state of a given poll.
 * @param req the request
 * @param req the response
 */
var getPoll = function (req, res) {
    var name = req.body.name;
    if (typeof name !== "string") {
        res.status(400).send("missing or invalid 'name' parameter");
        return;
    }
    var poll = polls.get(name);
    if (poll === undefined) {
        res.status(400).send("no poll with name '".concat(name, "'"));
        return;
    }
    res.send({ poll: poll }); // send back the current poll state
};
exports.getPoll = getPoll;
/**
 * Determines whether the given value is a record with option as string and voter as an array of numbers.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
var isOptionRecord = function (record) {
    return (0, exports.isRecord)(record) && typeof record.option === "string" && typeof record.voter === "number";
};
/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
var isRecord = function (val) {
    return val !== null && typeof val === "object";
};
exports.isRecord = isRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQWVBLElBQU0sS0FBSyxHQUFzQixJQUFJLEdBQUcsRUFBZ0IsQ0FBQztBQUV6RCxzREFBc0Q7QUFDL0MsSUFBTSxlQUFlLEdBQUc7SUFDN0IsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUZXLFFBQUEsZUFBZSxtQkFFMUI7QUFFRiwrRUFBK0U7QUFDeEUsSUFBTSxxQkFBcUIsR0FBRyxVQUFDLEVBQVU7OztRQUM5QyxLQUFtQixJQUFBLEtBQUEsU0FBQSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7WUFBOUIsSUFBTSxJQUFJLFdBQUE7WUFDYixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUNwQjs7Ozs7Ozs7O0FBQ0gsQ0FBQyxDQUFDO0FBSlcsUUFBQSxxQkFBcUIseUJBSWhDO0FBRUYsNEVBQTRFO0FBQzVFLDJFQUEyRTtBQUMzRSxJQUFNLFlBQVksR0FBRyxVQUFDLENBQU8sRUFBRSxDQUFPO0lBQ3BDLElBQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQixJQUFNLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDN0QsSUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzdELE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFD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