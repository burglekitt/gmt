import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current second for the specified IANA timeZone.
 *
 * - Returns empty string for invalid timeZone.
 * - Returns empty string when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedSecond("America/New_York") // "00"
 * @example getZonedSecond("UTC") // "00"
 * @example getZonedSecond("invalid") // ""
 * @returns current second string (zero-padded) or "" when invalid
 */
export function getZonedSecond(ianaTimezone: string): string {
  if (!isValidTimeZone(ianaTimezone)) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(ianaTimezone)
      .second.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
