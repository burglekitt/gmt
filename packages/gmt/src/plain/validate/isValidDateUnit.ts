import type { DateUnit } from "../../types";

/**
 * Return true when `unit` is a valid DateUnit.
 *
 * - Valid units are: "year", "month", "week", "day".
 * - Uses type assertion to narrow the type.
 *
 * @param unit candidate string
 * @returns boolean indicating validity
 *
 * @example isValidDateUnit("year") // true
 * @example isValidDateUnit("month") // true
 * @example isValidDateUnit("week") // true
 * @example isValidDateUnit("day") // true
 * @example isValidDateUnit("hour") // false
 * @example isValidDateUnit("invalid") // false
 */

export function isValidDateUnit(unit: string): unit is DateUnit {
  return (
    unit === "year" || unit === "month" || unit === "week" || unit === "day"
  );
}
