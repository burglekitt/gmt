import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current year from the Unix timestamp in UTC as a zero-padded string.
 *
 * @example getUnixYear() // "2024"
 * @example getUnixYear() // "" (on failure)
 * @returns current year string (zero-padded to 4 digits) or "" on failure
 */
export function getUnixYear(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .year.toString()
      .padStart(4, "0");
  } catch {
    return "";
  }
}
