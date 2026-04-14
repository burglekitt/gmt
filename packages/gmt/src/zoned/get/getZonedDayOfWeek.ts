import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current day of week for the specified IANA timeZone.
 *
 * - Returns null for invalid timeZone.
 * - Returns null when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @example getZonedDayOfWeek("America/New_York") // 3
 * @example getZonedDayOfWeek("UTC") // 4
 * @example getZonedDayOfWeek("invalid") // null
 * @returns current day of week number or null when invalid
 */
export function getZonedDayOfWeek(ianaTimezone: string): number | null {
  if (!isValidTimeZone(ianaTimezone)) return null;

  let now: Temporal.ZonedDateTime;
  try {
    now = Temporal.Now.zonedDateTimeISO(ianaTimezone);
  } catch {
    return null;
  }

  return now.dayOfWeek;
}
