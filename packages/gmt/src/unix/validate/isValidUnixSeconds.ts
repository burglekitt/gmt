import { unixSeconds } from "../../regex/unix";

/**
 * Return true when `timestamp` is a valid Unix seconds value.
 * - For strings: must be exactly 10 digits.
 * - For numbers: must be a non-negative integer.
 *
 * @param timestamp string or number candidate
 * @example isValidUnixSeconds("1700000000") => true
 * @example isValidUnixSeconds(1700000000) => true
 * @example isValidUnixSeconds("17000000000") => false (too many digits)
 * @example isValidUnixSeconds("not-a-number") => false (not a number)
 * @returns boolean indicating whether the timestamp is a valid Unix seconds value
 */
export function isValidUnixSeconds(timestamp: string | number): boolean {
  if (typeof timestamp === "string") {
    return unixSeconds.test(timestamp);
  }
  if (typeof timestamp === "number") {
    return Number.isInteger(timestamp) && timestamp >= 0;
  }
  return false;
}
