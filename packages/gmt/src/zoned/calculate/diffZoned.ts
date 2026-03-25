import { Temporal } from "@js-temporal/polyfill";
import { getLargestDateTimeUnit } from "../../plain/calculate/getLargestDateTimeUnit";
import { isValidDateTimeUnit } from "../../plain/validate";
import type { DateTimeUnits } from "../../types";
import { isValidZonedDateTime } from "../validate";

/**
 * Return the difference between two zoned datetimes measured in the given
 * date-time `unit` (year|month|day|hour|minute|...).
 *
 * - Uses Temporal.ZonedDateTime.until with `largestUnit` and extracts the
 *   requested unit from the resulting Duration.
 * - Returns `null` for invalid inputs.
 *
 * @param value1 zoned ISO 8601 datetime string (start)
 * @param value2 zoned ISO 8601 datetime string (end)
 * @param units DateTimeUnits | DateTimeUnits[] to measure the difference (e.g. "hours" | ["years", "months", "hours"])
 * @returns numeric difference in the requested unit, or null on invalid input
 */
export function diffZoned(
  value1: string,
  value2: string,
  units: DateTimeUnits | DateTimeUnits[],
): number | Record<DateTimeUnits, number> | null {
  const validZonedDateTimes =
    isValidZonedDateTime(value1) && isValidZonedDateTime(value2);
  const isSingleUnit = !Array.isArray(units);
  const validUnits = isSingleUnit
    ? isValidDateTimeUnit(units)
    : units.every((unit) => isValidDateTimeUnit(unit));

  if (!validZonedDateTimes || !validUnits) {
    return null;
  }

  try {
    const normalizedZdt1 =
      Temporal.ZonedDateTime.from(value1).withTimeZone("UTC");
    const normalizedZdt2 =
      Temporal.ZonedDateTime.from(value2).withTimeZone("UTC");

    const duration = normalizedZdt1.until(normalizedZdt2, {
      largestUnit: isSingleUnit ? units : getLargestDateTimeUnit(units),
    });

    if (isSingleUnit) {
      return duration[units] ?? 0;
    }

    return (units as DateTimeUnits[]).reduce(
      (result, unit) => {
        result[unit] = duration[unit] ?? 0;
        return result;
      },
      {} as Record<DateTimeUnits, number>,
    );
  } catch {
    return null;
  }
}
