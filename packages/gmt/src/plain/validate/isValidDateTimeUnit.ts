import type { DateTimeUnit } from "../../types";

/**
 * Return true when `unit` is a valid DateTimeUnit.
 *
 * @param unit candidate string
 * @example isValidDateTimeUnit("year") // true
 * @example isValidDateTimeUnit("month") // true
 * @example isValidDateTimeUnit("weeks") // false
 * @example isValidDateTimeUnit("invalid") // false
 * @returns boolean indicating validity
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
