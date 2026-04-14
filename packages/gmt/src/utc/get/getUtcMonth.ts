import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current month from UTC as a zero-padded string.
 *
 * @example getUtcMonth() // "02"
 * @example getUtcMonth() // "" (on failure)
 * @returns current month string (zero-padded to 2 digits) or "" on failure
 */
export function getUtcMonth(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .month.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
