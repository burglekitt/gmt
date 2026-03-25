import { Temporal } from "@js-temporal/polyfill";
import type { DateDurationUnit } from "../../types";
import { isValidDate, isValidDateUnit } from "../validate";
import { getLargestDateUnit } from "./getLargestDateUnit";

/**
 * Return the difference between two PlainDate values using the provided
 * `unit` (day|week|month|year).
 *
 * - Returns `null` for invalid inputs or units.
 * - Uses Temporal.PlainDate.until and extracts the requested unit from the
 *   resulting Duration.
 *
 * @param date1 ISO PlainDate string for the start
 * @param date2 ISO PlainDate string for the end
 * @param units DateDurationUnit | DateDurationUnit[] to measure the difference (e.g. "days" | ["years", "months"])
 * @returns numeric difference in the requested unit, or null on invalid input
 */
export function diffDate(
  date1: string,
  date2: string,
  units: DateDurationUnit | DateDurationUnit[],
): number | Record<DateDurationUnit, number> | null {
  const validDates = isValidDate(date1) && isValidDate(date2);
  const isSingleUnit = !Array.isArray(units);
  const validUnits = isSingleUnit
    ? isValidDateUnit(units)
    : units.every(isValidDateUnit);

  if (!validDates || !validUnits) {
    return null;
  }

  const d1 = Temporal.PlainDate.from(date1);
  const d2 = Temporal.PlainDate.from(date2);

  const duration = d1.until(d2, {
    largestUnit: isSingleUnit ? units : getLargestDateUnit(units),
  });

  // craft record for units passed
  if (isSingleUnit) {
    return duration[units] ?? 0;
  }

  return (units as DateDurationUnit[]).reduce(
    (result, unit) => {
      result[unit] = duration[unit] ?? 0;
      return result;
    },
    {} as Record<DateDurationUnit, number>,
  );
}
