import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone, isValidZonedDateTime } from "../validate";

/**
 * Convert a zoned ISO 8601 datetime string to the same instant in a
 * different `timeZone`.
 *
 * - Returns an empty string "" for invalid inputs.
 *
 * @param value zoned ISO 8601 datetime string
 * @param timeZone target IANA timeZone identifier
 * @example convertZonedToZoned("2024-02-29T12:34:56.789+00:00[UTC]", "America/New_York") // "2024-02-29T07:34:56.789-05:00[America/New_York]"
 * @example convertZonedToZoned("2024-02-29T12:34:56.789+00:00[UTC]", "Asia/Tokyo") // "2024-02-29T21:34:56.789+09:00[Asia/Tokyo]"
 * @example convertZonedToZoned("invalid", "America/New_York") // "" (invalid zoned datetime)
 * @example convertZonedToZoned("2024-02-29T12:34:56.789+00:00[UTC]", "Invalid/Zone") // "" (invalid timeZone)
 * @returns zoned ISO 8601 string in target timeZone or empty string when invalid
 */
export function convertZonedToZoned(value: string, timeZone: string): string {
  if (!isValidZonedDateTime(value) || !isValidTimeZone(timeZone)) {
    return "";
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime.withTimeZone(timeZone).toString();
  } catch {
    return "";
  }
}
