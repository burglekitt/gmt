import { Temporal } from "@js-temporal/polyfill";
import type { FractionalDigit } from "../../types";
import { isValidTime } from "../validate";

/**
 * Return the end of the specified time `unit` (hour|minute|second|...) for a given ISO 8601 time string.
 * - Uses Temporal.PlainTime
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value ISO 8601 time string
 * @param unit Temporal.TimeUnit to specify the unit for the end (e.g. "hour")
 * @example endOfTime("12:34:56", "hour") => "12:59:59.999999999"
 * @returns ISO 8601 string representing the end of the specified unit, or empty string on invalid input
 */
export function endOfTime(value: string, unit: Temporal.TimeUnit): string {
  if (!isValidTime(value)) return "";

  const supported: Temporal.TimeUnit[] = [
    "hour",
    "minute",
    "second",
    "millisecond",
    "microsecond",
    "nanosecond",
  ];
  if (!supported.includes(unit)) return "";

  const source = Temporal.PlainTime.from(value);

  // payloads set smaller fields to their maximum values
  const payloads: Record<Temporal.TimeUnit, Partial<Temporal.PlainTimeLike>> = {
    hour: {
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    minute: { second: 59, millisecond: 999, microsecond: 999, nanosecond: 999 },
    second: { millisecond: 999, microsecond: 999, nanosecond: 999 },
    millisecond: {
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    microsecond: {
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    },
    nanosecond: {
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

  const payload = payloads[unit];
  const result = source.with(payload as Partial<Temporal.PlainTimeLike>);
  const digits = fractionalMap[unit];
  return result.toString({
    fractionalSecondDigits: digits as FractionalDigit,
  });
}

export default endOfTime;
