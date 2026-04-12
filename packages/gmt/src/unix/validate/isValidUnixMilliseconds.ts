import { unixMilliseconds } from "../../regex/unix";

/**
 * Checks if a given string or number is a valid unix timestamp in milliseconds.
 * @param timestamp The timestamp to validate.
 * @returns True if the timestamp is valid, false otherwise.
 */
export function isValidUnixMilliseconds(timestamp: string | number): boolean {
  if (typeof timestamp === "string") {
    return unixMilliseconds.test(timestamp);
  }
  if (typeof timestamp === "number") {
    return Number.isInteger(timestamp) && timestamp >= 0;
  }
  return false;
}
