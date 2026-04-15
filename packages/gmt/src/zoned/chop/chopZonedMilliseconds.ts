import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Returns the zoned datetime string rounded/truncated to second precision
 * (removes millisecond precision) from an ISO 8601 zoned datetime input.
 * 
 * @param value - ISO 8601 zoned datetime string
 * @returns Zoned datetime string without milliseconds or an empty string for invalid input
 * 
 * @example chopZonedMilliseconds("2024-02-29T14:30:45.123-05:00[America/New_York]") // "2024-02-29T14:30:45-05:00[America/New_York]"
 * @example chopZonedMilliseconds("invalid") // "
 */
export function chopZonedMilliseconds(value: string): string {
  if (!isValidZonedDateTime(value)) return "";
  try {
    return Temporal.ZonedDateTime.from(value).toString({
      smallestUnit: "second",
    });
  } catch {
    return "";
  }
}
