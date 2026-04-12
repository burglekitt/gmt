import { Temporal } from "@js-temporal/polyfill";
import { getLargestDateTimeDurationUnit } from "../../plain/calculate/getLargestDateTimeDurationUnit";
import { getSystemTimezone } from "../../plain/get";
import { isValidDateTimeDurationUnit } from "../../plain/validate";
import type { DateTimeDurationUnit } from "../../types";
import { isValidTimeZone } from "../../zoned/validate";

/**
 * Return the difference between two Unix timestamps measured in the given unit.
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Returns `null` for invalid inputs.
 *
 * @param value1 first Unix timestamp
 * @param value2 second Unix timestamp
 * @param units DateTimeDurationUnit | DateTimeDurationUnit[] to measure the difference
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timeZone
 * @example diffUnix(1706745600000, 1706659200000, "day") // 1
 * @example diffUnix(1706745600, 1706659200, "day", { epochUnit: "seconds" }) // 1
 * @returns numeric difference in the requested unit, or null on invalid input
 */
export function diffUnix(
  value1: string | number,
  value2: string | number,
  units: DateTimeDurationUnit | DateTimeDurationUnit[],
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
  },
): number | Record<DateTimeDurationUnit, number> | null {
  const epochUnit = options?.epochUnit ?? "milliseconds";
  const timeZone = options?.timeZone ?? getSystemTimezone();

  if (!timeZone || !isValidTimeZone(timeZone)) return null;

  const isSingleUnit = !Array.isArray(units);
  const validUnits = isSingleUnit
    ? isValidDateTimeDurationUnit(units)
    : units.every(isValidDateTimeDurationUnit);

  if (!validUnits) {
    return null;
  }

  const numValue1 = typeof value1 === "string" ? Number(value1) : value1;
  const numValue2 = typeof value2 === "string" ? Number(value2) : value2;

  if (
    !Number.isFinite(numValue1) ||
    !Number.isInteger(numValue1) ||
    numValue1 < 0 ||
    !Number.isFinite(numValue2) ||
    !Number.isInteger(numValue2) ||
    numValue2 < 0
  ) {
    return null;
  }

  try {
    const instant1 = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numValue1 * 1000 : numValue1,
    );
    const instant2 = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numValue2 * 1000 : numValue2,
    );

    const zdt1 = instant1.toZonedDateTimeISO(timeZone);
    const zdt2 = instant2.toZonedDateTimeISO(timeZone);

    const duration = zdt1.until(zdt2, {
      largestUnit: isSingleUnit ? units : getLargestDateTimeDurationUnit(units),
    });

    if (isSingleUnit) {
      return duration[units] ?? 0;
    }

    return units.reduce(
      (result, unit) => {
        result[unit] = duration[unit] ?? 0;
        return result;
      },
      {} as Record<DateTimeDurationUnit, number>,
    );
  } catch {
    return null;
  }
}
