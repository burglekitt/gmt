import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current day of the week as a zero-padded string in the system timeZone.
 * - Uses the runtime system timeZone via `getSystemTimeZone()`.
 * - Returns an empty string when the system timeZone cannot be determined.
 *
 * @example getDayOfWeek() // "04"
 * @example getDayOfWeek() // "" (when system timeZone unavailable)
 * @returns current day of week string or "" when invalid
 */
export function getDayOfWeek(): number | null {
  const timeZone = getSystemTimeZone();
  if (!timeZone) return null;

  let now: Temporal.ZonedDateTime;
  try {
    now = Temporal.Now.zonedDateTimeISO(timeZone);
  } catch {
    return null;
  }

  return now.dayOfWeek;
}
