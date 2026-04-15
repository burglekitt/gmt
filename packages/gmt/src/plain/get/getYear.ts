import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current year as a zero-padded string in the system timeZone.
 *
 * @returns current year string (zero-padded) or "" when invalid
 *
 * @example getYear() // "2024"
 * @example getYear() // "" (when system timeZone unavailable)
 */
export function getYear(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(timeZone)
      .year.toString()
      .padStart(4, "0");
  } catch {
    return "";
  }
}
