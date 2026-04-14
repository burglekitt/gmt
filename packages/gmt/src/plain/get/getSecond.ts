import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current second using the system timeZone.
 *
 * - Uses the runtime system timeZone via `getNowUnit()`.
 * - Returns empty string when the system timeZone cannot be determined.
 *
 * @example getSecond() // "00"
 * @example getSecond() // "" (when system timeZone unavailable)
 * @returns current second string (zero-padded) or "" when invalid
 */
export function getSecond(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    return now.second.toString().padStart(2, "0");
  } catch {
    return "";
  }
}
