import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current nanosecond for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedNanosecond("America/New_York") // "000"
 * @example getZonedNanosecond("UTC") // "000"
 * @example getZonedNanosecond("invalid") // ""
 * @returns current nanosecond string (zero-padded to 3 digits) or "" when invalid
 */
export function getZonedNanosecond(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return (Temporal.Now.zonedDateTimeISO(ianaTimezone).nanosecond ?? 0)
      .toString()
      .padStart(3, "0");
  } catch {
    return "";
  }
}
