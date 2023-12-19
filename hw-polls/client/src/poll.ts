import { isRecord } from "./record";

// Description of an individual poll
export type Poll = {
    readonly name: string,
    readonly endTime: number, // ms since epoch
    readonly options: unknown[],
    readonly total: number,
}

/**
 * Parses unknown data into an Poll. Will log an error and return undefined
 * if it is not a valid Poll.
 * @param val unknown data to parse into a Poll
 * @return Poll if val is a valid Poll and undefined otherwise
 */
export const parsePoll = (val: unknown): undefined | Poll => {
    if (!isRecord(val)) {
      console.error("not an Poll", val)
      return undefined;
    }
  
    if (typeof val.name !== "string") {
      console.error("not a poll: missing 'name'", val)
      return undefined;
    }
    
    if (typeof val.endTime !== "number" || val.endTime < 0 || isNaN(val.endTime)) {
      console.error("not a poll: missing or invalid 'endTime'", val)
      return undefined;
    }
        
    if (!Array.isArray(val.options) || !val.options.every(parseOptions)) {
      console.error("not a poll: 'options' must be an array of records with string and number", val);
      return undefined;
    } else if (val.options.length < 2) {
      console.error("not a poll: The length of 'options' must be more than two items", val);
      return undefined;
    }

    if (typeof val.total !== "number" || val.total < 0 || isNaN(val.total)) {
      console.error("not a poll: missing or invalid total voters", val);
      return;
    }

    return { name: val.name, endTime: val.endTime, options: val.options, total: val.total };
  };

  /** helper function to check poll.options is an records with one string and one number arguments */
  export const parseOptions = (record: unknown): record is { option: string, voter: number} => {
    return isRecord(record) && typeof record.option === "string" && typeof record.voter === "number";
  }