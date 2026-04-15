import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current nanosecond using the system timeZone.
 *
 * @returns current nanosecond string (zero-padded to 3 digits) or "" when invalid
 *
 * @example getNanosecond() // "000"
 * @example getNanosecond() // "" (when system timeZone unavailable)
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
