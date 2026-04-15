import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Extract the plain date portion from an ISO 8601 zoned datetime string.
 *
 * - Returns empty string "" for invalid zoned datetime inputs.
 *
 * @param value zoned ISO 8601 datetime string
 * @example parseZonedDate("2024-02-29T12:34:56.789+00:00[UTC]") // "2024-02-29"
 * @example parseZonedDate("2024-03-10T12:34:56.789-05:00[America/New_York]") // "2024-03-10"
 * @example parseZonedDate("invalid") // "" (invalid input)
 * @returns plain ISO date string (YYYY-MM-DD) or empty string when invalid
 */
export function parseZonedDate(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime?.toPlainDate().toString();
  } catch {
    return "";
  }
}
