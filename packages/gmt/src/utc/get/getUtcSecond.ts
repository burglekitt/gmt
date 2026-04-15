import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current second from UTC as a zero-padded string.
 *
 * @returns current second string (zero-padded to 2 digits) or "" on failure
 *
 * @example getUtcSecond() // "45"
 * @example getUtcSecond() // "" (on failure)
 */
export function getUtcSecond(): string {
  try {
    return Temporal.Now.instant()
      .toZonedDateTimeISO("UTC")
      .second.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
