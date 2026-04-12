import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimezone } from "../../plain/get";
import { isValidDateTimeDurationUnit } from "../../plain/validate";
import type { DateTimeDurationUnit } from "../../types";
import { isValidTimeZone } from "../../zoned/validate";

/**
 * Add a temporal amount to a Unix epoch value and return the resulting epoch.
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Uses the system timeZone to interpret the epoch, or a provided IANA timeZone.
 * - Returns empty string for invalid inputs.
 *
 * @param value Unix timestamp (number or string)
 * @param units Partial<Record<DateTimeDurationUnit, number>> object specifying units to add
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timeZone
 * @example addUnix(1706659200000, { days: 1 }) // "1706745600000"
 * @example addUnix(1706659200, { days: 1 }, { epochUnit: "seconds" }) // "1706745600"
 * @returns Unix epoch string after addition, or "" on invalid input
 */
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

  if (!timeZone || !isValidTimeZone(timeZone)) return "";

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
