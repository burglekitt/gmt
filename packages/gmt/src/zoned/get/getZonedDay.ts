import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current day of month for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedDay("America/New_York") // "28"
 * @example getZonedDay("UTC") // "29"
 * @example getZonedDay("invalid") // ""
 * @returns current day string (zero-padded) or "" when invalid
 */
export function getZonedDay(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .day.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
