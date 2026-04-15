import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current day of month using the system timeZone.
 *
 * @returns current day string (zero-padded) or "" when invalid
 *
 * @example getDay() // "29"
 * @example getDay() // "" (when system timeZone unavailable)
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
