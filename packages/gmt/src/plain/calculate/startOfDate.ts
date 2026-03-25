import { Temporal } from "@js-temporal/polyfill";
import { isValidDate } from "../validate";

/**
 * Return the start of the specified date-time `unit` (year|month|day|hour|minute|...)
 * for a given ISO 8601 datetime string.
 *
 * - Uses Temporal.PlainDateTime
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value ISO 8601 datetime string
 * @param unit Temporal.DateUnit to specify the unit for the start (e.g. "month")
 * @example startOfDate("2024-02-29", "month") => "2024-02-01"
 *
 * @returns ISO 8601 string representing the start of the specified unit, or empty string on invalid input
 */
export function startOfDate(value: string, unit: Temporal.DateUnit): string {
  if (!isValidDate(value)) return "";

  const supported: Temporal.DateUnit[] = ["year", "month", "week"];
  if (!supported.includes(unit)) return "";

  const source = Temporal.PlainDate.from(value);

  // Week start: compute how many days to subtract to reach Monday.
  // Use modular arithmetic so logic differs from other implementations but yields the same result.
  if (unit === "week") {
    const daysFromMonday = (source.dayOfWeek + 6) % 7; // Monday -> 0, Sunday -> 6
    return source.subtract({ days: daysFromMonday }).toString();
  }

  if (unit === "year") return source.with({ month: 1, day: 1 }).toString();
  if (unit === "month") return source.with({ day: 1 }).toString();

  // day -> the plain date itself
  return source.toString();
}
