import { Temporal } from "@js-temporal/polyfill";
import { isValidDate } from "../validate";

/**
 * Return the end of the specified date `unit` (year|month|week|day) for a given ISO 8601 date string.
 * - Uses Temporal.PlainDate
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value ISO 8601 date string
 * @param unit Temporal.DateUnit to specify the unit for the end (e.g. "month")
 * @example endOfDate("2024-02-29", "month") => "2024-02-29"
 * @returns ISO 8601 string representing the end of the specified unit, or empty string on invalid input
 */
export function endOfDate(value: string, unit: Temporal.DateUnit): string {
  if (!isValidDate(value)) return "";

  const supported: Temporal.DateUnit[] = ["year", "month", "week", "day"];
  if (!supported.includes(unit)) return "";

  const source = Temporal.PlainDate.from(value);

  if (unit === "week") {
    const daysToSunday = (7 - source.dayOfWeek) % 7; // Sunday as week end
    return source.add({ days: daysToSunday }).toString();
  }

  if (unit === "year") {
    return source.with({ month: 12, day: 31 }).toString();
  }

  if (unit === "month") {
    const firstOfNext = source.with({ day: 1 }).add({ months: 1 });
    return firstOfNext.subtract({ days: 1 }).toString();
  }

  // day -> the plain date itself (end of date as date string)
  return source.toString();
}

export default endOfDate;
