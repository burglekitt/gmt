import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current hour using the system timeZone.
 *
 * - Uses the runtime system timeZone via `getSystemTimeZone()`.
 * - Returns empty string when the system timeZone cannot be determined.
 *
 * @example getHour() // "00"
 * @example getHour() // "" (when system timeZone unavailable)
 * @returns current hour string (zero-padded) or "" when invalid
 */
export function getHour(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    return now.hour.toString().padStart(2, "0");
  } catch {
    return "";
  }
}
