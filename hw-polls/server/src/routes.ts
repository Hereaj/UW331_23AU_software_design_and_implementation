import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

type Poll = {
  name: string,
  endTime: number,
  options: unknown[],
  total: number,
}

const polls: Map<string, Poll> = new Map<string, Poll>();

/** Testing function to remove all the added polls. */
export const resetForTesting = (): void => {
  polls.clear();
};

/** Testing function to move all end times forward the given amount (of ms). */
export const advanceTimeForTesting = (ms: number): void => {
  for (const poll of polls.values()) {
    poll.endTime -= ms;
  }
};

// Sort polls with the ones finishing soonest first, but with all those that
// are completed after those that are not and in reverse order by end time.
const comparePolls = (a: Poll, b: Poll): number => {
  const now: number = Date.now();
  const endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
  const endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
  return endA - endB;
};

/**
 * Returns a list of all the polls, sorted so that the ongoing polls come
 * first, with the ones about to end listed first, and the completed ones after,
 * with the ones completed more recently
 * @param _req the request
 * @param res the response
 */
export const listPolls = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(polls.values());
  vals.sort(comparePolls);
  res.send({polls: vals});
};

/**
 * Add the item to the list.
 * @param req the request
 * @param res the response
 */
export const addPoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const minutes = req.body.minutes;
  if (typeof minutes !== "number") {
    res.status(400).send(`'minutes' is not a number: ${minutes}`);
    return;
  } else if (isNaN(minutes) || minutes < 1 || Math.round(minutes) !== minutes) {
    res.status(400).send(`'minutes' is not a positive integer: ${minutes}`);
    return;
  }

  const options = req.body.options;
  if (!Array.isArray(options) || !options.every(isOptionRecord)) {
    res.status(400).send("'options' must be an array of records with string and number");
    return;
  } else if (options.length < 2) {
    res.status(400).send("The length of 'options' must be more than two items");
    return;
  }

  const total = req.body.total;
  if (typeof total !== "number" || isNaN(total)) {
    res.status(400).send("'total' must be an number or missing");
    return;
  } else if (Math.round(total) !== total || total < 0) {
    res.status(400).send(`'total' is not a positive integer: ${total}`);
    return;
  }

  // Make sure there is no poll with this name already.
  if (polls.has(name)) {
    res.status(400).send(`poll for '${name}' already exists`);
    return;
  }
  
  const poll: Poll = {
    name: name,
    endTime: Date.now() + minutes * 60 * 1000,  // convert to ms
    options: options,
    total: total,
  };

  polls.set(poll.name, poll); // add this to the map of polls
  res.send({poll: poll});  // send the poll we made
}

/**
 * Add voter information for every matched poll
 * array of string, voters from indiviual element of picked is subset of voters.
 * @param req the request
 * @param res the response
 */
export const vote = (req: SafeRequest, res: SafeResponse): void => {
  const option = req.body.option;
  if (typeof option !== 'string') {
    res.status(400).send("missing 'voter' parameter");
    return;
  }

  const name = req.body.name;
  if (typeof name !== 'string') {
    res.status(400).send("missing 'name' parameter");
    return;
  }

  const poll = polls.get(name);
  if (poll === undefined) {
    res.status(400).send(`no poll with name '${name}'`);
    return;
  }

  const now = Date.now();
  if (now >= poll.endTime) {
    res.status(400).send(`auction for "${poll.name}" has already ended`);
    return;
  }

  if (!Array.isArray(poll.options) || !poll.options.every(isOptionRecord)) {
    res.status(400).send("'options' must be an array of records with string and number");
    return;
  }

  // query parameter "option" must be an element of poll.options
  for (const item of poll.options) {
    if (option === item.option) {
      item.voter = item.voter + 1;
    }
  }
  
  poll.total = poll.total + 1;

  res.send({poll: poll});  // send back the updated poll state
}

/**
 * Retrieves the current state of a given poll.
 * @param req the request
 * @param req the response
 */
export const getPoll = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (typeof name !== "string") {
    res.status(400).send("missing or invalid 'name' parameter");
    return;
  }

  const poll = polls.get(name);
  if (poll === undefined) {
    res.status(400).send(`no poll with name '${name}'`);
    return;
  }

  res.send({poll: poll});  // send back the current poll state
}

/**
 * Determines whether the given value is a record with option as string and voter as an array of numbers.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
const isOptionRecord = (record: unknown): record is { option: string, voter: number} => {
  return isRecord(record) && typeof record.option === "string" && typeof record.voter === "number";
}

/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
};