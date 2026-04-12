import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { isValidUnixUnit } from "../../unix/validate/isValidUnixUnit";
import { isValidTimeZone } from "../../zoned/validate";

/**
 * Return the start of the quarter for a Unix timestamp.
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Returns empty string for invalid inputs.
 *
 * @param value Unix timestamp (number or string)
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timeZone
 * @example startOfQuarterForUnix(1706659200000) // "1704067200000"
 * @example startOfQuarterForUnix(1706659200, { epochUnit: "seconds" }) // "1704067200"
 * @returns Unix epoch string representing the start of the quarter, or "" on invalid input
 */
export function startOfQuarterForUnix(
  value: string | number,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
  },
): string {
  const epochUnit = options?.epochUnit ?? "milliseconds";
  const timeZone = options?.timeZone ?? getSystemTimezone();

  if (!timeZone || !isValidTimeZone(timeZone) || !isValidUnixUnit(epochUnit)) {
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
    const month = zdt.month;
    const quarterStartMonth = Math.floor((month - 1) / 3) * 3 + 1;

    const result = zdt.with({
      month: quarterStartMonth,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });

    const epoch =
      epochUnit === "seconds"
        ? Math.floor(result.epochMilliseconds / 1000)
        : result.epochMilliseconds;

    return epoch.toString();
  } catch {
    return "";
  }
}
