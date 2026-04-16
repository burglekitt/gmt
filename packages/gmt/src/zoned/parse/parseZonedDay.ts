import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Return the day of the month from an ISO 8601 zoned datetime string.
 *
 * - Uses Temporal.ZonedDateTime.from to parse the input string.
 * - Returns the day as a zero-padded string (e.g., "01", "15", "31").
 *
 * @param value zoned ISO 8601 datetime string
 * @returns string representation of the day of the month or "" on invalid input
 *
 * @example parseZonedDay("2024-02-29T12:34:56.789+00:00[UTC]") // "29"
 * @example parseZonedDay("invalid") // ""
 */
export function parseZonedDay(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime.day.toString().padStart(2, "0");
  } catch {
    return "";
  }
}
