import { Temporal } from "@js-temporal/polyfill";
import type { FractionalDigit } from "../../types";
import { isValidDateTime } from "../validate";

/**
 * Return the start of the specified date-time `unit` (year|month|day|hour|minute|...)
 * for a given ISO 8601 datetime string.
 *
 * - Uses Temporal.PlainDateTime
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value ISO 8601 datetime string
 * @param unit Temporal.DateUnit|Temporal.TimeUnit to specify the unit for the start (e.g. "month")
 * @example startOfDateTime("2024-02-29T12:34:56", "month") => "2024-02-01T00:00:00"
 *
 * @returns ISO 8601 string representing the start of the specified unit, or empty string on invalid input
 */
export function startOfDateTime(
  value: string,
  unit: Temporal.DateUnit | Temporal.TimeUnit,
): string {
  if (!isValidDateTime(value)) return "";

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

  if (!supported.includes(unit)) return "";

  const source = Temporal.PlainDateTime.from(value);

  const dateUnits = ["year", "month", "week", "day"] as const;
  const timeUnits = [
    "hour",
    "minute",
    "second",
    "millisecond",
    "microsecond",
    "nanosecond",
  ] as const;

  const fractionalDigits: Record<string, FractionalDigit> = {
    year: 0,
    month: 0,
    week: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 3,
    microsecond: 6,
    nanosecond: 9,
  };

  const timeResets: Record<string, Partial<Temporal.PlainDateTimeLike>> = {
    hour: {
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    },
    minute: { second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 },
    second: { millisecond: 0, microsecond: 0, nanosecond: 0 },
    millisecond: { millisecond: 0, microsecond: 0, nanosecond: 0 },
    microsecond: { millisecond: 0, microsecond: 0, nanosecond: 0 },
    nanosecond: { millisecond: 0, microsecond: 0, nanosecond: 0 },
  };

  // date-unit handling: reset smaller date parts and zero time
  if ((dateUnits as readonly string[]).includes(unit as string)) {
    if (unit === "week") {
      const daysFromMonday = (source.dayOfWeek + 6) % 7;
      const adjusted = source.subtract({ days: daysFromMonday });
      const out = adjusted.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      });
      return out.toString({ fractionalSecondDigits: 0 });
    }

    const datePayload: Partial<Temporal.PlainDateTimeLike> = {};
    if (unit === "year") {
      datePayload.month = 1;
      datePayload.day = 1;
    }
    if (unit === "month") {
      datePayload.day = 1;
    }

    const out = source.with({
      ...datePayload,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
    return out.toString({ fractionalSecondDigits: 0 });
  }

  // time-unit handling: keep date, reset smaller time parts
  if ((timeUnits as readonly string[]).includes(unit as string)) {
    const payload = timeResets[unit as string] ?? {};
    const result = source.with(payload);
    const digits = fractionalDigits[unit as string] as FractionalDigit;
    return result.toString({ fractionalSecondDigits: digits });
  }

  return "";
}
