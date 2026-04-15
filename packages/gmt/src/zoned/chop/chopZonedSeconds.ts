import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Returns the zoned datetime string truncated to minute precision
 * (removes seconds and milliseconds) from an ISO 8601 zoned datetime input.
 *
 * @param value - ISO 8601 zoned datetime string
 * @returns Zoned datetime string at minute precision or an empty string for invalid input
 * 
 * @example chopZonedSeconds("2024-02-29T14:30:45.123-05:00[America/New_York]") // "2024-02-29T14:30-05:00[America/New_York]"
 * @example chopZonedSeconds("invalid") // ""
 */
export function chopZonedSeconds(value: string): string {
  if (!isValidZonedDateTime(value)) return "";
  try {
    return Temporal.ZonedDateTime.from(value).toString({
      smallestUnit: "minute",
    });
  } catch {
    return "";
  }
}
