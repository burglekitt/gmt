import { Temporal } from "@js-temporal/polyfill";
import { weekOfYear } from "../../plain/calculate/weekOfYear";
import { isValidTimeZone } from "../validate";

/**
 * Return the current week of year for the specified IANA timeZone.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @param weekStartsOn optional: "monday" | "sunday" (defaults to "monday")
 * @returns current week number (1-53) or null when invalid
 *
 * @example getZonedWeekOfYear("America/New_York") // 9
 * @example getZonedWeekOfYear("invalid") // null
 */
export function getZonedWeekOfYear(
  ianaTimezone: string,
  weekStartsOn?: "monday" | "sunday",
): number | null {
  if (!isValidTimeZone(ianaTimezone)) return null;

  try {
    const now = Temporal.Now.zonedDateTimeISO(ianaTimezone);
    return weekOfYear(now.toPlainDate().toString(), { weekStartsOn });
  } catch {
    return null;
  }
}
