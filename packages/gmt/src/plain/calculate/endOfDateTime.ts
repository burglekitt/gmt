import { Temporal } from "@js-temporal/polyfill";
import type { FractionalDigit } from "../../types";
import { isValidDateTime } from "../validate";
import { endOfDate } from "./endOfDate";

/**
 * Return the end of the specified date-time `unit` (year|month|day|hour|minute|...)
 * for a given ISO 8601 datetime string.
 * - Uses Temporal.PlainDateTime
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value ISO 8601 datetime string
 * @param unit Temporal.DateUnit | Temporal.TimeUnit to specify the unit for the end (e.g. "month")
 * @example endOfDateTime("2024-02-29T12:34:56", "month") => "2024-02-29T23:59:59.999999999"
 * @returns ISO 8601 string representing the end of the specified unit, or empty string on invalid input
 */
export function endOfDateTime(
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

  // date units: compute end date and set time to max (23:59:59.999...)
  const dateUnits = ["year", "month", "week", "day"] as const;

  if ((dateUnits as readonly string[]).includes(unit as string)) {
    const endDateStr = endOfDate(
      source.toPlainDate().toString(),
      unit as Temporal.DateUnit,
    );
    if (!endDateStr) return "";
    const datePart = Temporal.PlainDate.from(endDateStr);
    const out = Temporal.PlainDateTime.from({
      year: datePart.year,
      month: datePart.month,
      day: datePart.day,
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    });
    return out.toString({ fractionalSecondDigits: 0 });
  }

  // time units: keep date, set time fields to max for the unit
  const timePayloads: Record<
    Temporal.TimeUnit,
    Partial<Temporal.PlainDateTimeLike>
  > = {
    hour: {
      hour: source.hour,
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    minute: {
      hour: source.hour,
      minute: source.minute,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    second: {
      hour: source.hour,
      minute: source.minute,
      second: source.second,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    millisecond: {
      hour: source.hour,
      minute: source.minute,
      second: source.second,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    microsecond: {
      hour: source.hour,
      minute: source.minute,
      second: source.second,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    nanosecond: {
      hour: source.hour,
      minute: source.minute,
      second: source.second,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
  };

  const fractionalMap: Record<Temporal.TimeUnit, number> = {
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 3,
    microsecond: 6,
    nanosecond: 9,
  };

  const payload = timePayloads[
    unit as Temporal.TimeUnit
  ] as Partial<Temporal.PlainDateTimeLike>;
  const result = source.with(payload);
  const digits = fractionalMap[unit as Temporal.TimeUnit];
  return result.toString({
    fractionalSecondDigits: digits as FractionalDigit,
  });
}

export default endOfDateTime;
