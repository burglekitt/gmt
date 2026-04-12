import { isValidAmount } from "../../internal";

/**
 * Return the earliest (minimum) of the given Unix timestamp values.
 *
 * - Returns null if the array is empty.
 * - Accepts Unix timestamps in seconds or milliseconds.
 *
 * @param unixValues Array of Unix timestamps (e.g. 1699531200)
 * @returns The earliest Unix timestamp, or null on invalid input
 */
export function minUnix(unixValues: number[]): number | null {
  if (!unixValues.length) return null;

  const valid = unixValues.filter(isValidAmount);
  if (!valid.length) return null;

  return Math.min(...valid);
}
