import { Temporal } from "@js-temporal/polyfill";
import type { TimeUnits } from "../../types";
import { isValidTime, isValidTimeUnit } from "../validate";
import { getLargestTimeUnit } from "./getLargestTimeUnit";

/**
 * Return the difference between two PlainTime values in the requested unit.
 *
 * - Returns `null` if inputs or unit are invalid.
 * - Uses Temporal.PlainTime.until with `largestUnit` and extracts the
 *   requested unit value from the resulting Duration.
 *
 * @param time1 ISO PlainTime string for the start
 * @param time2 ISO PlainTime string for the end
 * @param units TimeUnits to measure the difference (e.g. "hours", "minutes", "seconds")
 * @returns numeric difference in the requested unit, or null on invalid input
 */
export function diffTime(
  time1: string,
  time2: string,
  units: TimeUnits | TimeUnits[],
): number | Record<TimeUnits, number> | null {
  const validTimes = isValidTime(time1) && isValidTime(time2);
  const isSingleUnit = !Array.isArray(units);
  const validUnits = isSingleUnit
    ? isValidTimeUnit(units)
    : units.every(isValidTimeUnit);

  if (!validTimes || !validUnits) {
    return null;
  }

  const t1 = Temporal.PlainTime.from(time1);
  const t2 = Temporal.PlainTime.from(time2);

  const duration = t1.until(t2, {
    largestUnit: isSingleUnit ? units : getLargestTimeUnit(units),
  });

  // craft record for units passed
  if (isSingleUnit) {
    return duration[units] ?? 0;
  }

  return (units as TimeUnits[]).reduce(
    (result, unit) => {
      result[unit] = duration[unit] ?? 0;
      return result;
    },
    {} as Record<TimeUnits, number>,
  );
}
