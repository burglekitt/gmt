import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Returns the local plain datetime (date + time) extracted from a zoned datetime string.
 *
 * @param value - ISO 8601 zoned datetime string
 * @returns Local plain datetime string or an empty string for invalid input
 * 
 * @example chopZonedTimezone("2024-02-29T14:30:45.123-05:00[America/New_York]") // "2024-02-29T14:30:45.123"
 * @example chopZonedTimezone("invalid") // ""
 */
export function chopZonedTimezone(value: string): string {
  if (!isValidZonedDateTime(value)) return "";
  try {
    return Temporal.ZonedDateTime.from(value).toPlainDateTime().toString();
  } catch {
    return "";
  }
}
