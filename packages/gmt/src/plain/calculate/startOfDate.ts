import { Temporal } from "@js-temporal/polyfill";
import { isValidDate } from "../validate";

const supported: Temporal.DateUnit[] = ["year", "month", "week"];

/**
 * Return the start of the specified date-time `unit` (year|month|day|hour|minute|...)
 * for a given ISO 8601 date string.
 *
 * @param value ISO 8601 date string
 * @param unit Temporal.DateUnit to specify the unit for the start (e.g. "month")
 * @options { weekStartsOn: "monday" | "sunday" = 'monday' } - Optional parameter to specify the start of the week when unit is "week". Default is "monday".
 * @returns ISO 8601 string representing the start of the specified unit, or empty string on invalid input
 * 
 * @example startOfDate("2024-02-29", "month") => "2024-02-01"
 * @example startOfDate("2024-02-29", "year") => "2024-01-01"
 * @example startOfDate("2024-02-29", "week") => "2024-02-26" (Monday start)
 * @example startOfDate("2024-02-29", "week", { weekStartsOn: "sunday" }) => "2024-02-25" (Sunday start)
 * @example startOfDate("invalid-date", "month") => "" (invalid date input)
 */
export function startOfDate(
  value: string,
  unit: Temporal.DateUnit,
  optionsArg?: { weekStartsOn?: "monday" | "sunday" },
): string {
  const weekStartsOn = optionsArg?.weekStartsOn ?? "monday";

  if (!isValidDate(value) || !supported.includes(unit)) return "";

  try {
    const source = Temporal.PlainDate.from(value);
    let result: Temporal.PlainDate;

    switch (unit) {
      case "year":
        result = source.with({ month: 1, day: 1 });
        break;
      case "month":
        result = source.with({ day: 1 });
        break;
      case "week": {
        // Week start: compute how many days to subtract to reach Monday.
        // Temporal: 1 (Mon) to 7 (Sun)
        // If Monday start: Monday(1) subtracts 0, Sunday(7) subtracts 6.
        // If Sunday start: Sunday(7) subtracts 0, Monday(1) subtracts 1.
        const daysToSubtract =
          weekStartsOn === "monday"
            ? source.dayOfWeek - 1
            : source.dayOfWeek % 7;

        result = source.subtract({ days: daysToSubtract });
        break;
      }
      default:
        return "";
    }

    return result.toString();
  } catch {
    return "";
  }
}
