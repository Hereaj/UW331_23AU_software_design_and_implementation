import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Map from file name to item.
const files: Map<string, unknown> = new Map<string, unknown>();

/**
 * Handle request for /save by storing the given name.
 * @param req the request
 * @param res the response
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing.');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing.')
    return;
  }

  const hasValue = files.has(name);
  res.send({replaced: hasValue});
  files.set(name, value);
}

/** Handles request for /load by returning the transcript requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing.');
    return;
  } else if (!files.has(name)) {
    res.status(400).send(`The given argument name - "${name}" does not have any values.`);
    return;
  }
  
  res.send({value: files.get(name)});
}

/**
 * Return a list of all files with the given name.
 * @param _req the request
 * @param res the response
 */
export const listFiles = (_req: SafeRequest, res: SafeResponse): void => {
  const fileLists: string[] = [];
  
  for (const file of files.keys()) {
    fileLists.push(file);
  }

  res.send({files: fileLists });
}

/** Used in tests to set the files map back to empty. */
export const resetForTesting = (): void => {
  files.clear()
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
