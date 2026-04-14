import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current minute for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedMinute("America/New_York") // "00"
 * @example getZonedMinute("UTC") // "00"
 * @example getZonedMinute("invalid") // ""
 * @returns current minute string (zero-padded) or "" when invalid
 */
export function getZonedMinute(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .minute.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
