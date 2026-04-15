import type { TimeUnit } from "../../types";

/**
 * Return true when `unit` is a valid TimeUnit.
 * 
 * @param unit candidate string
 * @returns boolean indicating validity
 * 
 * @example isValidTimeUnit("hour") // true
 * @example isValidTimeUnit("minute") // true
 * @example isValidTimeUnit("second") // true
 * @example isValidTimeUnit("invalid") // false
 */

export const isValidTimeUnit = (unit: string): unit is TimeUnit => {
  return (
    unit === "hour" ||
    unit === "minute" ||
    unit === "second" ||
    unit === "millisecond" ||
    unit === "microsecond" ||
    unit === "nanosecond"
  );
};
