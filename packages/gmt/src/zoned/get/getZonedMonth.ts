import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current month for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedMonth("America/New_York") // "02"
 * @example getZonedMonth("UTC") // "02"
 * @example getZonedMonth("invalid") // ""
 * @returns current month string (zero-padded) or "" when invalid
 */
export function getZonedMonth(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .month.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
