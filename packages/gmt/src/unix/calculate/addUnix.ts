import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimezone } from "../../plain/get";
import { isValidDateTimeDurationUnit } from "../../plain/validate";
import type { DateTimeDurationUnit } from "../../types";
import { convertUnixToZoned } from "../convert";

/**
 * Add a temporal amount to a unix epoch value and return a new unix epoch value.
 *
 * - Inputs can be string or number (representing unix epoch)
 * - epochUnit specifies whether input is seconds or milliseconds
 * - Returns string representation of the resulting unix epoch
 * - On invalid input returns empty string ""
 *
 * @param value unix epoch in milliseconds or seconds
 * @param units Partial<Record<DateTimeDurationUnit, number>> object specifying units to add
 * @param options epochUnit: "seconds" | "milliseconds"
 * @returns unix epoch as string on success, or "" on invalid input
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

  if (!timeZone) return "";

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
    const zoned = convertUnixToZoned(numValue, timeZone, epochUnit);
    if (!zoned) return "";

    const zdt = Temporal.ZonedDateTime.from(zoned);
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
