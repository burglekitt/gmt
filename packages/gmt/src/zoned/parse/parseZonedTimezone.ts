import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Extract the IANA timeZone identifier from an ISO 8601 zoned datetime
 * string.
 *
 * - Returns empty string "" for invalid zoned datetime inputs.
 *
 * @param value zoned ISO 8601 datetime string
 * @example parseZonedTimezone("2024-02-29T12:34:56.789+00:00[UTC]") // "UTC"
 * @example parseZonedTimezone("2024-03-10T12:34:56.789-05:00[America/New_York]") // "America/New_York"
 * @example parseZonedTimezone("invalid") // "" (invalid input)
 * @returns IANA timeZone id or empty string when invalid
 */
export function parseZonedTimezone(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }
  try {
    return Temporal.ZonedDateTime.from(value).timeZoneId ?? "";
  } catch {
    return "";
  }
}
