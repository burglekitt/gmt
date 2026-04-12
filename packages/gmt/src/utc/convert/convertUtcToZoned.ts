import { Temporal } from "@js-temporal/polyfill";
import { isValidTimezone } from "../../zoned/validate";
import { isValidUtc } from "../validate";

/**
 * Convert a UTC Instant string to a zoned ISO 8601 datetime string in the
 * specified `timeZone`.
 *
 * - `value` must be a parseable UTC Instant string.
 * - `timeZone` must be a valid IANA timezone id.
 * - Returns empty string "" for invalid inputs.
 *
 * @param value UTC Instant string
 * @param timeZone IANA timezone identifier
 * @returns zoned ISO 8601 string or empty string when invalid
 */
export function convertUtcToZoned(value: string, timeZone: string): string {
  if (!isValidUtc(value) || !isValidTimezone(timeZone)) {
    return "";
  }

  try {
    return Temporal.Instant.from(value).toZonedDateTimeISO(timeZone).toString();
  } catch {
    return "";
  }
}
