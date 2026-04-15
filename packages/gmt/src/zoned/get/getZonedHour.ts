import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current hour for the specified IANA timeZone.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @returns current hour string (zero-padded to 2 digits) or "" when invalid
 *
 * @example getZonedHour("America/New_York") // "19"
 * @example getZonedHour("invalid") // ""
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
