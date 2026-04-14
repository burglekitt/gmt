import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current millisecond for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedMillisecond("America/New_York") // "000"
 * @example getZonedMillisecond("UTC") // "000"
 * @example getZonedMillisecond("invalid") // ""
 * @returns current millisecond string (zero-padded to 3 digits) or "" when invalid
 */
export function getZonedMillisecond(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .millisecond.toString()
      .padStart(3, "0");
  } catch {
    return "";
  }
}
