import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current microsecond using the system timeZone.
 *
 * @returns current microsecond string (zero-padded to 3 digits) or "" when invalid
 * 
 * @example getMicrosecond() // "000"
 * @example getMicrosecond() // "" (when system timeZone unavailable)
 */
export function getMicrosecond(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    return (now.microsecond ?? 0).toString().padStart(3, "0");
  } catch {
    return "";
  }
}
