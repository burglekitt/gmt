import type { Temporal } from "@js-temporal/polyfill";

export const isValidDateUnit = (unit: string): unit is Temporal.DateUnit => {
  /**
   * Return true when `unit` is a valid Temporal.DateUnit.
   *
   * @param unit string candidate
   * @returns boolean indicating whether the unit is valid
   */
  return (
    unit === "year" || unit === "month" || unit === "week" || unit === "day"
  );
};
