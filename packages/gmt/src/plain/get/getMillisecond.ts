import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current millisecond using the system timeZone.
 *
 * @returns current millisecond string (zero-padded to 3 digits) or "" when invalid
 *
 * @example getMillisecond() // "000"
 * @example getMillisecond() // "" (when system timeZone unavailable)
 *
 */
export function getMillisecond(): string {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return "";
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    return (now.millisecond ?? 0).toString().padStart(3, "0");
  } catch {
    return "";
  }
}
