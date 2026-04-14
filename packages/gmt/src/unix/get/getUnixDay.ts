import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current day from the Unix timestamp in UTC as a zero-padded string.
 *
 * @example getUnixDay() // "29"
 * @example getUnixDay() // "" (on failure)
 * @returns current day string (zero-padded to 2 digits) or "" on failure
 */
export function getUnixDay(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .day.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
