import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current hour for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedHour("America/New_York") // "19"
 * @example getZonedHour("UTC") // "00"
 * @example getZonedHour("invalid") // ""
 * @returns current hour string (zero-padded) or "" when invalid
 */
export function getZonedHour(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .hour.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
