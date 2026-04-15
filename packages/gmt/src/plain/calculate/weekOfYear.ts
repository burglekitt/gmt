import { Temporal } from "@js-temporal/polyfill";
import { isWeekStartsOn } from "../../internal/isWeekStartsOn";
import { isValidDate } from "../validate";

/**
 * Calculate the week number of the year for a given ISO 8601 date string.
 *
 * @param value ISO 8601 date string
 * @param optionsArg { weekStartsOn: "monday" | "sunday" } - Optional parameter to specify the start of the week. Default is "monday".
 * @returns Week number of the year (1-53), or null for invalid input
 * 
 * @example weekOfYear("2024-01-01") => 1
 * @example weekOfYear("2024-01-07") => 1
 * @example weekOfYear("2024-01-08") => 2
 * @example weekOfYear("2024-12-31") => 1 (since it falls in the first week of 2025 if week starts on Monday)
 * @example weekOfYear("2024-12-31", { weekStartsOn: "sunday" }) => 53 (since it falls in the last week of 2024 if week starts on Sunday)
 * @example weekOfYear("invalid-date") => null
 */
export function weekOfYear(
  value: string,
  optionsArg?: { weekStartsOn?: "monday" | "sunday" },
): number | null {
  const weekStartsOn = isWeekStartsOn(optionsArg?.weekStartsOn)
    ? optionsArg?.weekStartsOn
    : "monday";
  if (!isValidDate(value)) return null;

  try {
    const date = Temporal.PlainDate.from(value);

    // Get the day of the year (1-366)
    const dayOfYear = date.dayOfYear;

    // Get the weekday (1-7, where 1 is Monday and 7 is Sunday)
    const dayOfWeek = date.dayOfWeek;

    // Calculate the offset based on the start of the week
    //   const offset = weekStartsOn === "monday" ? dayOfWeek - 1 : dayOfWeek % 7;
    const offset = weekStartsOn === "monday" ? dayOfWeek - 1 : dayOfWeek % 7;

    // Calculate the week number
    const weekNumber = Math.ceil((dayOfYear + offset) / 7);

    return weekNumber;
  } catch {
    return null;
  }
}
