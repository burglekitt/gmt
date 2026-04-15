import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Convert a zoned ISO 8601 datetime string to a plain datetime string.
 *
 * - Returns the local datetime portion (without timezone annotation).
 * - Returns empty string "" for invalid inputs.
 * - Leap-second inputs return empty string.
 *
 * @param value zoned ISO 8601 datetime string
 * @example convertZonedToPlainDateTime("2024-02-29T14:30:45.123-05:00[America/New_York]") // "2024-02-29T14:30:45.123"
 * @example convertZonedToPlainDateTime("2024-02-29T14:30:45+13:00[Pacific/Apia]") // "2024-02-29T14:30:45"
 * @returns plain datetime string or "" when invalid
 */
export function convertZonedToPlainDateTime(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  try {
    return Temporal.ZonedDateTime.from(value).toPlainDateTime().toString();
  } catch {
    return "";
  }
}
