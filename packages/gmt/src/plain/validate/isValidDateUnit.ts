import type { DateUnit } from "../../types";

/**
 * Return true when `unit` is a valid DateUnit.
 *
 * @param unit candidate string
 * @example isValidDateUnit("year") // true
 * @example isValidDateUnit("month") // true
 * @example isValidDateUnit("week") // true
 * @example isValidDateUnit("day") // true
 * @example isValidDateUnit("hour") // false
 * @example isValidDateUnit("invalid") // false
 * @returns boolean indicating validity
 */

export function isValidDateUnit(unit: string): unit is DateUnit {
  return (
    unit === "year" || unit === "month" || unit === "week" || unit === "day"
  );
}
