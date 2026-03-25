import type { TimeUnits } from "../../types";

/**
 * Return true when `unit` is a valid TimeUnit.
 *
 * @param unit string candidate
 * @returns boolean indicating whether the unit is valid
 */
export const isValidTimeUnit = (unit: string): unit is TimeUnits => {
  return (
    unit === "hours" ||
    unit === "minutes" ||
    unit === "seconds" ||
    unit === "milliseconds" ||
    unit === "microseconds" ||
    unit === "nanoseconds"
  );
};
