import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Return the week of the year (1-53) for a given ISO 8601 zoned datetime string.
 *
 * - Returns string for week number.
 * - Returns "" for invalid input.
 *
 * @param value ISO zoned datetime string
 * @returns Week number as string or "" on invalid input
 *
 * @example parseWeekFromZoned("2024-01-01T14:30:45.123+00:00[UTC]") // "1"
 * @example parseWeekFromZoned("2024-01-08T14:30:45.123+00:00[UTC]") // "2"
 * @example parseWeekFromZoned("invalid") // ""
 */
export function parseWeekFromZoned(value: string): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return (zonedDateTime.weekOfYear ?? 0).toString();
  } catch {
    return "";
  }
}
