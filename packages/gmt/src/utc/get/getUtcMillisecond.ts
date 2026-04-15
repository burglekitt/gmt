import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current millisecond from UTC as a zero-padded string.
 *
 * @returns current millisecond string (zero-padded to 3 digits) or "" on failure
 *
 * @example getUtcMillisecond() // "123"
 * @example getUtcMillisecond() // "" (on failure)
 */
export function getUtcMillisecond(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .millisecond.toString()
      .padStart(3, "0");
  } catch {
    return "";
  }
}
