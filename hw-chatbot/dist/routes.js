"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTranscriptsForTesting = exports.load = exports.save = exports.chat = void 0;
var words_1 = require("./words");
var patterns_1 = require("./patterns");
var chatbot_1 = require("./chatbot");
// Keep track of the most recently used response for each pattern.
var lastUsed = new Map();
// Keep track of possible responses for when we run out of things to say.
var memory = [];
// TODO(6a): declare a Map to record transcripts
var transcripts = new Map();
/**
 * Handles request for /chat, with a message included as a query parameter,
 * by getting the next chat response.
 */
var chat = function (req, res) {
    var msg = first(req.query.message);
    if (msg === undefined) {
        res.status(400).send('required argument "message" was missing');
        return;
    }
    var words = (0, words_1.splitWords)(msg);
    var result = (0, chatbot_1.chatResponse)(words, lastUsed, memory, patterns_1.PATTERNS);
    res.send({ response: (0, words_1.joinWords)(result) });
};
exports.chat = chat;
/** Handles request for /save by storing the given transcript. */
var save = function (req, res) {
    var name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    var value = req.body.value;
    if (value === undefined) {
        res.status(400).send('required argument "value" was missing');
        return;
    }
    // TODO(6a): implement this part
    //  - store the passed in value in the map under the given name
    //  - return a record indicating whether that replaced an existing transcript
    var isName = transcripts.has(name);
    res.send({ replaced: isName });
    transcripts.set(name, value);
};
exports.save = save;
/** Handles request for /load by returning the transcript requested. */
var load = function (req, res) {
    var name = first(req.query.name);
    if (name === undefined || !transcripts.has(name)) {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    res.send({ value: transcripts.get(name) });
    // TODO(6b): implement this function
};
exports.load = load;
/** Used in tests to set the transcripts map back to empty. */
var resetTranscriptsForTesting = function () {
    // TODO(6a): remove all saved transcripts from the map
    transcripts.clear();
};
exports.resetTranscriptsForTesting = resetTranscriptsForTesting;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
var first = function (param) {
    if (Array.isArray(param) && param.length > 0) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxpQ0FBZ0Q7QUFDaEQsdUNBQXNDO0FBQ3RDLHFDQUF5QztBQVF6QyxrRUFBa0U7QUFDbEUsSUFBTSxRQUFRLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFDO0FBRWhFLHlFQUF5RTtBQUN6RSxJQUFNLE1BQU0sR0FBZSxFQUFFLENBQUM7QUFFOUIsZ0RBQWdEO0FBQ2hELElBQU0sV0FBVyxHQUF5QixJQUFJLEdBQUcsRUFBbUIsQ0FBQztBQUVyRTs7O0dBR0c7QUFDSSxJQUFNLElBQUksR0FBRyxVQUFDLEdBQWdCLEVBQUUsR0FBaUI7SUFDdEQsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7UUFDaEUsT0FBTztLQUNSO0lBRUQsSUFBTSxLQUFLLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQU0sTUFBTSxHQUFHLElBQUEsc0JBQVksRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxtQkFBUSxDQUFDLENBQUM7SUFDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFBLGlCQUFTLEVBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQTtBQVZZLFFBQUEsSUFBSSxRQVVoQjtBQUVELGlFQUFpRTtBQUMxRCxJQUFNLElBQUksR0FBRyxVQUFDLEdBQWdCLEVBQUUsR0FBaUI7SUFDdEQsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDM0IsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU87S0FDUjtJQUVELElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQzlELE9BQU87S0FDUjtJQUVELGdDQUFnQztJQUNoQywrREFBK0Q7SUFDL0QsNkVBQTZFO0lBRTdFLElBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQzdCLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQTtBQXBCWSxRQUFBLElBQUksUUFvQmhCO0FBRUQsdUVBQXVFO0FBQ2hFLElBQU0sSUFBSSxHQUFHLFVBQUMsR0FBZ0IsRUFBRSxHQUFpQjtJQUN0RCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDN0QsT0FBTztLQUNSO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUN6QyxvQ0FBb0M7QUFDdEMsQ0FBQyxDQUFBO0FBVFksUUFBQSxJQUFJLFFBU2hCO0FBR0QsOERBQThEO0FBQ3ZELElBQU0sMEJBQTBCLEdBQUc7SUFDeEMsc0RBQXNEO0lBQ3RELFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixDQUFDLENBQUM7QUFIVyxRQUFBLDBCQUEwQiw4QkFHckM7QUFHRix3RUFBd0U7QUFDeEUsNEVBQTRFO0FBQzVFLG1EQUFtRDtBQUNuRCxJQUFNLEtBQUssR0FBRyxVQUFDLEtBQWM7SUFDM0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzVDLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO1NBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDcEMsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNO1FBQ0wsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDLENBQUEifQ==