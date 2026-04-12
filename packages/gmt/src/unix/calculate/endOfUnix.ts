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
 * Return the end of the specified unit for a Unix timestamp.
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Returns empty string for invalid inputs.
 *
 * @param value Unix timestamp (number or string)
 * @param unit Temporal.DateUnit | Temporal.TimeUnit to specify the end
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timezone, weekStartsOn optional "monday" | "sunday"
 * @example endOfUnix(1706659200000, "year") // "1735689600000"
 * @example endOfUnix(1706659200000, "month") // "1708012800000"
 * @example endOfUnix(1706659200, "day", { epochUnit: "seconds" }) // "1706736000"
 * @returns Unix epoch string representing the end of the unit, or "" on invalid input
 */
export function endOfUnix(
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
        result = source.with({ month: 12, day: 31 }).withPlainTime({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      case "month": {
        const lastDay = Temporal.PlainDate.from({
          year: source.year,
          month: source.month,
          day: 1,
        }).daysInMonth;
        result = source.with({ day: lastDay }).withPlainTime({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      }
      case "week": {
        const daysToSubtract =
          weekStartsOn === "monday"
            ? source.dayOfWeek - 1
            : source.dayOfWeek % 7;
        const endOfWeek = source
          .subtract({ days: daysToSubtract })
          .add({ days: 6 });
        result = endOfWeek.withPlainTime({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      }
      case "day":
        result = source.withPlainTime({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      case "hour":
        result = source.with({
          minute: 59,
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      case "minute":
        result = source.with({
          second: 59,
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      case "second":
        result = source.with({
          millisecond: 999,
          microsecond: 999,
          nanosecond: 999,
        });
        break;
      case "millisecond":
        result = source.with({ microsecond: 999, nanosecond: 999 });
        break;
      case "microsecond":
        result = source.with({ nanosecond: 999 });
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
