import type { DateTimeUnit } from "../../types";

/**
 * Return true when `unit` is a valid DateTimeUnit.
 *
 * - Valid units are: "year", "month", "week", "day", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond".
 * - Uses type assertion to narrow the type.
 *
 * @param unit candidate string
 * @returns boolean indicating validity
 *
 * @example isValidDateTimeUnit("year") // true
 * @example isValidDateTimeUnit("month") // true
 * @example isValidDateTimeUnit("weeks") // false
 * @example isValidDateTimeUnit("invalid") // false
 */

export function isValidDateTimeUnit(unit: string): unit is DateTimeUnit {
  return (
    unit === "year" ||
    unit === "month" ||
    unit === "week" ||
    unit === "day" ||
    unit === "hour" ||
    unit === "minute" ||
    unit === "second" ||
    unit === "millisecond" ||
    unit === "microsecond" ||
    unit === "nanosecond"
  );
}
