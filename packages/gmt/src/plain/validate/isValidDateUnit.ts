import type { DateUnits } from "../../types";

/**
 * Return true when `unit` is a valid DateUnit.
 *
 * @param unit string candidate
 * @returns boolean indicating whether the unit is valid
 */
export const isValidDateUnit = (unit: string): unit is DateUnits => {
  return (
    unit === "years" || unit === "months" || unit === "weeks" || unit === "days"
  );
};
