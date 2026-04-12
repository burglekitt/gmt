import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimezone } from "../../plain/get";
import { isValidDateTimeDurationUnit } from "../../plain/validate";
import type { DateTimeDurationUnit } from "../../types";
import { isValidTimezone } from "../../zoned/validate";

export function addUnix(
  value: string | number,
  units: Partial<Record<DateTimeDurationUnit, number>>,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
  },
): string {
  const epochUnit = options?.epochUnit ?? "milliseconds";
  const timeZone = options?.timeZone ?? getSystemTimezone();

  if (!timeZone || !isValidTimezone(timeZone)) return "";

  const validUnits = Object.keys(units).every(isValidDateTimeDurationUnit);
  const validAmounts = Object.values(units).every(isValidAmount);

  if (!validUnits || !validAmounts) {
    return "";
  }

  const numValue = typeof value === "string" ? Number(value) : value;
  if (
    !Number.isFinite(numValue) ||
    !Number.isInteger(numValue) ||
    numValue < 0
  ) {
    return "";
  }

  try {
    const instant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numValue * 1000 : numValue,
    );

    const zdt = instant.toZonedDateTimeISO(timeZone);
    const result = zdt.add(units);
    const epoch =
      epochUnit === "seconds"
        ? Math.floor(result.epochMilliseconds / 1000)
        : result.epochMilliseconds;
    return epoch.toString();
  } catch {
    return "";
  }
}
