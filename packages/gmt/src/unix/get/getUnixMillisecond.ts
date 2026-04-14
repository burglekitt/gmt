import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current millisecond from the Unix timestamp in UTC as a zero-padded string.
 *
 * @example getUnixMillisecond() // "123"
 * @example getUnixMillisecond() // "" (on failure)
 * @returns current millisecond string (zero-padded to 3 digits) or "" on failure
 */
export function getUnixMillisecond(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .millisecond.toString()
      .padStart(3, "0");
  } catch {
    return "";
  }
}
