import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current hour from the Unix timestamp in UTC as a zero-padded string.
 *
 * @returns current hour string (zero-padded to 2 digits) or "" on failure
 *
 * @example getUnixHour() // "00"
 * @example getUnixHour() // "" (on failure)
 */
export function getUnixHour(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .hour.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
