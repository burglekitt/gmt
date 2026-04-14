import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current day from UTC as a zero-padded string.
 *
 * @example getUtcDay() // "29"
 * @example getUtcDay() // "" (on failure)
 * @returns current day string (zero-padded to 2 digits) or "" on failure
 */
export function getUtcDay(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .day.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
