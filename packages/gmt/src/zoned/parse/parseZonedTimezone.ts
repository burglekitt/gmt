import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Extract the IANA timeZone identifier from an ISO 8601 zoned datetime string.
 *
 * - Extracts timezone id from a ZonedDateTime.
 * - Returns "" for invalid input.
 *
 * @param value zoned ISO 8601 datetime string
 * @returns IANA timeZone id or "" when invalid
 *
 * @example parseZonedTimezone("2024-02-29T12:34:56.789+00:00[UTC]") // "UTC"
 * @example parseZonedTimezone("invalid") // ""
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
