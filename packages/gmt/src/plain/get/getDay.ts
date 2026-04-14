import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current day of month using the system timeZone.
 *
 * - Uses the runtime system timeZone via `getCurrentUnit()`.
 * - Returns empty string when the system timeZone cannot be determined.
 *
 * @example getDay() // "29"
 * @example getDay() // "" (when system timeZone unavailable)
 * @returns current day string (zero-padded) or "" when invalid
 */
export function getDay(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(timeZone)
      .day.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
