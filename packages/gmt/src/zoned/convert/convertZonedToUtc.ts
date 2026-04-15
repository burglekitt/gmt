import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Convert an ISO 8601 zoned datetime string to a UTC Instant string (ISO).
 *
 * - Accepts a zoned ISO 8601 datetime string and returns an Instant string
 *   (e.g. "2024-02-29T00:00:00Z").
 * - On invalid input returns an empty string "".
 *
 * @param value zoned ISO 8601 datetime string
 * @example convertZonedToUtc("2024-02-29T12:34:56.789+00:00[UTC]") // "2024-02-29T12:34:56.789Z"
 * @example convertZonedToUtc("2024-02-29T07:34:56.789-05:00[America/New_York]") // "2024-02-29T12:34:56.789Z"
 * @example convertZonedToUtc("invalid") // "" (invalid input)
 * @returns UTC Instant ISO string or empty string when invalid
 */
export function convertZonedToUtc(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  try {
    return Temporal.ZonedDateTime.from(value).toInstant().toString();
  } catch {
    return "";
  }
}
