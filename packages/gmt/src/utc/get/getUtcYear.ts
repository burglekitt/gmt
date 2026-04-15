import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current year from UTC as a zero-padded string.
 *
 * @returns current year string (zero-padded to 4 digits) or "" on failure
 *
 * @example getUtcYear() // "2024"
 * @example getUtcYear() // "" (on failure)
 */
export function getUtcYear(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .year.toString()
      .padStart(4, "0");
  } catch {
    return "";
  }
}
