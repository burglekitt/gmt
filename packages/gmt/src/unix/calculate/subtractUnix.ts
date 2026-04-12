import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimezone } from "../../plain/get";
import { isValidDateTimeDurationUnit } from "../../plain/validate";
import type { DateTimeDurationUnit } from "../../types";
import { isValidTimezone } from "../../zoned/validate";

/**
 * Subtract a temporal amount from a Unix epoch value and return the resulting epoch.
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Returns empty string for invalid inputs.
 *
 * @param value Unix timestamp (number or string)
 * @param units Partial<Record<DateTimeDurationUnit, number>> object specifying units to subtract
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timezone
 * @example subtractUnix(1706745600000, { days: 1 }) // "1706659200000"
 * @example subtractUnix(1706745600, { days: 1 }, { epochUnit: "seconds" }) // "1706659200"
 * @returns Unix epoch string after subtraction, or "" on invalid input
 */
export function subtractUnix(
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
    const result = zdt.subtract(units);
    const epoch =
      epochUnit === "seconds"
        ? Math.floor(result.epochMilliseconds / 1000)
        : result.epochMilliseconds;
    return epoch.toString();
  } catch {
    return "";
  }
}
