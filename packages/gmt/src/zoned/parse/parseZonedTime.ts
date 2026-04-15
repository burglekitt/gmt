import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Extract the plain time portion from an ISO 8601 zoned datetime string.
 *
 * - Returns empty string "" for invalid zoned datetime inputs.
 *
 * @param value zoned ISO 8601 datetime string
 * @example parseZonedTime("2024-02-29T12:34:56.789+00:00[UTC]") // "12:34:56.789"
 * @example parseZonedTime("2024-03-10T12:34:56.789-05:00[America/New_York]") // "12:34:56.789"
 * @example parseZonedTime("invalid") // "" (invalid input)
 * @returns plain time string (HH:mm:ss[.sss]) or empty string when invalid
 */
export function parseZonedTime(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime?.toPlainTime().toString();
  } catch {
    return "";
  }
}
