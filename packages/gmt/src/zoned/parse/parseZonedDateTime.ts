import { Temporal } from "@js-temporal/polyfill";
import { isLeapSecond } from "../../plain/validate/isLeapSecond";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Parse a zoned datetime and return the plain local datetime portion as an
 * ISO plain datetime string (YYYY-MM-DDTHH:mm:ss...).
 *
 * - Leap-second inputs return an empty string.
 * - Invalid inputs return an empty string.
 *
 * @param value zoned ISO 8601 datetime string
 * @example parseZonedDateTime("2024-02-29T12:34:56.789+00:00[UTC]") // "2024-02-29T12:34:56.789"
 * @example parseZonedDateTime("2024-03-10T12:34:56.789-05:00[America/New_York]") // "2024-03-10T12:34:56.789"
 * @example parseZonedDateTime("2024-06-30T23:59:60+00:00[UTC]") // "" (leap second)
 * @example parseZonedDateTime("invalid") // "" (invalid input)
 * @returns plain local datetime string or empty string when invalid
 */
export const parseZonedDateTime = (value: string): string => {
  if (!isValidZonedDateTime(value) || isLeapSecond(value)) {
    return "";
  }

  try {
    return Temporal.ZonedDateTime.from(value).toPlainDateTime().toString();
  } catch {
    return "";
  }
};
