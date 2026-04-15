/**
 * Return true when `timestamp` is a valid Unix milliseconds value.
 *
 * - Must be a non-negative integer.
 * - Returns false for non-numbers or negative values.
 *
 * @param timestamp number candidate
 * @returns boolean indicating whether the timestamp is a valid Unix milliseconds value
 *
 * @example isValidUnixMilliseconds(1700000000000) // true
 * @example isValidUnixMilliseconds(-1) // false
 */
export function isValidUnixMilliseconds(timestamp: unknown): boolean {
  if (typeof timestamp === "number") {
    return Number.isInteger(timestamp) && timestamp >= 0;
  }
  return false;
}
