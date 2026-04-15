import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current minute using the system timeZone.
 *
 * @returns current minute string (zero-padded) or "" when invalid
 *
 * @example getMinute() // "00"
 * @example getMinute() // "" (when system timeZone unavailable)
 */
export function getMinute(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    return now.minute.toString().padStart(2, "0");
  } catch {
    return "";
  }
}
