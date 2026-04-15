import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current ISO day of the week as a number in the system timeZone.
 *
 * - Uses the runtime system timeZone via `getSystemTimeZone()`.
 * - Returns `null` when the system timeZone cannot be determined or the current time cannot be read.
 * - ISO day of week: 1 (Monday) to 7 (Sunday).
 *
 * @returns current ISO day of week number (1-7) or null when invalid
 * 
 * @example getDayOfWeek() // 4
 * @example getDayOfWeek() // null (when system timeZone unavailable)
 */
export function getDayOfWeek(): number | null {
  const timeZone = getSystemTimeZone();
  if (!timeZone) return null;

  try {
    const now = Temporal.Now.zonedDateTimeISO(timeZone);
    return now.dayOfWeek;
  } catch {
    return null;
  }
}
