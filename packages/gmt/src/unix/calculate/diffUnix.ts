import { Temporal } from "@js-temporal/polyfill";
import { getLargestDateTimeDurationUnit } from "../../plain/calculate/getLargestDateTimeDurationUnit";
import { getSystemTimezone } from "../../plain/get";
import { isValidDateTimeDurationUnit } from "../../plain/validate";
import type { DateTimeDurationUnit } from "../../types";
import { convertUnixToZoned } from "../convert";

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

  if (!timeZone) return null;

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
    const zoned1 = convertUnixToZoned(numValue1, timeZone, epochUnit);
    const zoned2 = convertUnixToZoned(numValue2, timeZone, epochUnit);

    if (!zoned1 || !zoned2) return null;

    const zdt1 = Temporal.ZonedDateTime.from(zoned1);
    const zdt2 = Temporal.ZonedDateTime.from(zoned2);

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
