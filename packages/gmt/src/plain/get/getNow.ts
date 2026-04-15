import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Return the current local PlainDateTime as an ISO string using the
 * system timeZone.
 *
 * @returns ISO 8601 PlainDateTime string or an empty string on error
 *
 * @example getNow() // "2024-03-15T14:30:45" (current time)
 */
export function getNow(): string {
  const timeZone = getSystemTimeZone();

  if (!timeZone) {
    return "";
  }

  try {
    return Temporal.Now.zonedDateTimeISO(timeZone).toPlainDateTime().toString();
  } catch {
    return "";
  }
}
