import { Temporal } from "@js-temporal/polyfill";
import { weekOfYear } from "../../plain/calculate/weekOfYear";
import { isValidTimeZone } from "../validate";

/**
 * Return the current week of year for the specified IANA timeZone.
 *
 * - Returns null for invalid timeZone.
 * - Returns null when timeZone cannot be resolved.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @param weekStartsOn "monday" | "sunday" - Optional, defaults to "monday"
 * @example getZonedWeekOfYear("America/New_York") // 9
 * @example getZonedWeekOfYear("UTC") // 9
 * @example getZonedWeekOfYear("invalid") // null
 * @returns current week number or null when invalid
 */
export function getZonedWeekOfYear(
  ianaTimezone: string,
  weekStartsOn?: "monday" | "sunday",
): number | null {
  if (!isValidTimeZone(ianaTimezone)) return null;

  let now: Temporal.ZonedDateTime;
  try {
    now = Temporal.Now.zonedDateTimeISO(ianaTimezone);
  } catch {
    return null;
  }

  return weekOfYear(now.toPlainDate().toString(), { weekStartsOn });
}
