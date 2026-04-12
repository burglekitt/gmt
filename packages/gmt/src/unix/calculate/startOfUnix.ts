import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { isValidUnixUnit } from "../../unix/validate/isValidUnixUnit";
import { isValidTimezone } from "../../zoned/validate";

const supported: (Temporal.DateUnit | Temporal.TimeUnit)[] = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond",
  "microsecond",
  "nanosecond",
];

/**
 * Return the start of the specified unit for a Unix timestamp.
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Returns empty string for invalid inputs.
 *
 * @param value Unix timestamp (number or string)
 * @param unit Temporal.DateUnit | Temporal.TimeUnit to specify the start
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timezone, weekStartsOn optional "monday" | "sunday"
 * @example startOfUnix(1706659200000, "year") // "1704067200000"
 * @example startOfUnix(1706659200000, "month") // "1705353600000"
 * @example startOfUnix(1706659200, "day", { epochUnit: "seconds" }) // "1706640000"
 * @returns Unix epoch string representing the start of the unit, or "" on invalid input
 */
export function startOfUnix(
  value: string | number,
  unit: Temporal.DateUnit | Temporal.TimeUnit,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
    weekStartsOn?: "monday" | "sunday";
  },
): string {
  const epochUnit = options?.epochUnit ?? "milliseconds";
  const timeZone = options?.timeZone ?? getSystemTimezone();
  const weekStartsOn = options?.weekStartsOn ?? "monday";

  if (
    !timeZone ||
    !supported.includes(unit) ||
    !isValidTimezone(timeZone) ||
    !isValidUnixUnit(epochUnit)
  ) {
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
    const epochMs = epochUnit === "seconds" ? numValue * 1000 : numValue;
    const instant = Temporal.Instant.fromEpochMilliseconds(epochMs);

    const source = instant.toZonedDateTimeISO(timeZone);
    let result: Temporal.ZonedDateTime;

    switch (unit) {
      case "year":
        result = source.with({ month: 1, day: 1 }).withPlainTime();
        break;
      case "month":
        result = source.with({ day: 1 }).withPlainTime();
        break;
      case "week": {
        const daysToSubtract =
          weekStartsOn === "monday"
            ? source.dayOfWeek - 1
            : source.dayOfWeek % 7;
        result = source.subtract({ days: daysToSubtract }).withPlainTime();
        break;
      }
      case "day":
        result = source.withPlainTime();
        break;
      case "hour":
        result = source.with({
          minute: 0,
          second: 0,
          millisecond: 0,
          microsecond: 0,
          nanosecond: 0,
        });
        break;
      case "minute":
        result = source.with({
          second: 0,
          millisecond: 0,
          microsecond: 0,
          nanosecond: 0,
        });
        break;
      case "second":
        result = source.with({
          millisecond: 0,
          microsecond: 0,
          nanosecond: 0,
        });
        break;
      case "millisecond":
        result = source.with({ microsecond: 0, nanosecond: 0 });
        break;
      case "microsecond":
        result = source.with({ nanosecond: 0 });
        break;
      case "nanosecond":
        result = source;
        break;
      default:
        return "";
    }

    const epoch =
      epochUnit === "seconds"
        ? Math.floor(result.epochMilliseconds / 1000)
        : result.epochMilliseconds;

    return epoch.toString();
  } catch {
    return "";
  }
}
