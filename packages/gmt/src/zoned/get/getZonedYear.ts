import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current year for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedYear("America/New_York") // "2024"
 * @example getZonedYear("UTC") // "2024"
 * @example getZonedYear("invalid") // ""
 * @returns current year string (zero-padded) or "" when invalid
 */
export function getZonedYear(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .year.toString()
      .padStart(4, "0");
  } catch {
    return "";
  }
}
