import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current month using the system timeZone.
 *
 * - Uses the runtime system timeZone via `getNowUnit()`.
 * - Returns empty string when the system timeZone cannot be determined.
 *
 * @example getMonth() // "02"
 * @example getMonth() // "" (when system timeZone unavailable)
 * @returns current month string (zero-padded) or "" when invalid
 */
export function getMonth(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) return "";

  try {
    return Temporal.Now.zonedDateTimeISO(timeZone)
      .month.toString()
      .padStart(2, "0");
  } catch {
    return "";
  }
}
