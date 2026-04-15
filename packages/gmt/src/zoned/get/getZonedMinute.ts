import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current minute for the specified IANA timeZone.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @returns current minute string (zero-padded to 2 digits) or "" when invalid
 *
 * @example getZonedMinute("America/New_York") // "00"
 * @example getZonedMinute("invalid") // ""
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
