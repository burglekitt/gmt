import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current microsecond using the system timeZone.
 *
 * - Uses the runtime system timeZone via `getSystemTimeZone()`.
 * - Returns empty string when the system timeZone cannot be determined.
 *
 * @example getMicrosecond() // "000"
 * @example getMicrosecond() // "" (when system timeZone unavailable)
 * @returns current microsecond string (zero-padded to 3 digits) or "" when invalid
 */
export function getMicrosecond(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  const now = Temporal.Now.plainDateTimeISO(timeZone);
  return (now.microsecond ?? 0).toString().padStart(3, "0");
}
