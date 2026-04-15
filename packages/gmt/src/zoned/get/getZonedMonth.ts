import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current month for the specified IANA timeZone.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @returns current month string (zero-padded to 2 digits) or "" when invalid
 *
 * @example getZonedMonth("America/New_York") // "02"
 * @example getZonedMonth("invalid") // ""
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
