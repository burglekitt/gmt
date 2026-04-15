import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current minute from the Unix timestamp in UTC as a zero-padded string.
 *
 * @returns current minute string (zero-padded to 2 digits) or "" on failure
 *
 * @example getUnixMinute() // "30"
 * @example getUnixMinute() // "" (on failure)
 */
export function getUnixMinute(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .minute.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
