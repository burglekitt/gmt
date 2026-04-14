import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current nanosecond using the system timeZone.
 *
 * - Uses the runtime system timeZone via `getNowUnit()`.
 * - Returns empty string when the system timeZone cannot be determined.
 *
 * @example getNanosecond() // "000"
 * @example getNanosecond() // "" (when system timeZone unavailable)
 * @returns current nanosecond string (zero-padded to 3 digits) or "" when invalid
 */
export function getNanosecond(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    return (now.nanosecond ?? 0).toString().padStart(3, "0");
  } catch {
    return "";
  }
}
