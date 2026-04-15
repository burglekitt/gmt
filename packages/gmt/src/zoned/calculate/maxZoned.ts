import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

/**
 * Return the latest (maximum) of the given ZonedDateTime values.
 *
 * @param zonedDateTimes Array of ISO ZonedDateTime strings (e.g. "2024-03-10T12:00:00[America/New_York]")
 * @returns The latest zoned datetime string, or null on invalid input
 * 
 * @example maxZoned(["2024-03-10T12:00:00[America/New_York]", "2024-03-15T12:00:00[America/New_York]"]) // "2024-03-15T12:00:00-04:00[America/New_York]"
 * @example maxZoned(["invalid", "2024-03-15T12:00:00[America/New_York]"]) // "2024-03-15T12:00:00-04:00[America/New_York]"
 * @example maxZoned(["invalid", "also invalid"]) // null
 * @example maxZoned([]) // null
 */
export function maxZoned(zonedDateTimes: string[]): string | null {
  if (!zonedDateTimes.length) return null;

  const valid = zonedDateTimes.filter(isValidZonedDateTime);
  if (!valid.length) return null;

  try {
    const comparables = valid.map((d) => Temporal.ZonedDateTime.from(d));
    comparables.sort(Temporal.ZonedDateTime.compare);

    return comparables[comparables.length - 1].toString();
  } catch {
    return null;
  }
}
