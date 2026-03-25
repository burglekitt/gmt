import type { DateTimeUnits } from "../../types";

/**
 * Return true when `unit` is a valid DateTimeUnit.
 *
 * @param unit candidate string
 * @returns boolean indicating validity
 */
export const isValidDateTimeUnit = (unit: string): unit is DateTimeUnits => {
  return (
    unit === "years" ||
    unit === "months" ||
    unit === "weeks" ||
    unit === "days" ||
    unit === "hours" ||
    unit === "minutes" ||
    unit === "seconds" ||
    unit === "milliseconds" ||
    unit === "microseconds" ||
    unit === "nanoseconds"
  );
};
