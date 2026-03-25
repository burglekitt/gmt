import { Temporal } from "@js-temporal/polyfill";
import type { FractionalDigit } from "../../types";
import { isValidTime } from "../validate";

/**
 * Return the start of the specified time `unit` (hour|minute|second|...) for a given ISO 8601 time string.
 *
 * - Uses Temporal.PlainTime
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value ISO 8601 time string
 * @param unit Temporal.TimeUnit to specify the unit for the start (e.g. "hour")
 * @example startOfTime("12:34:56", "hour") => "12:00:00"
 *
 * @returns ISO 8601 string representing the start of the specified unit, or empty string on invalid input
 */
export function startOfTime(value: string, unit: Temporal.TimeUnit): string {
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

  if (unit === "hour") {
    const t = source.with({
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });
    return t.toString({ fractionalSecondDigits: 0 });
  }

  if (unit === "minute") {
    const t = source.with({ second: 0 });
    return t.toString({ fractionalSecondDigits: 0 });
  }

  if (unit === "second") {
    const t = source.with({ millisecond: 0, microsecond: 0, nanosecond: 0 });
    return t.toString({ fractionalSecondDigits: 0 });
  }

  const resets: Record<Temporal.TimeUnit, Partial<Temporal.PlainTimeLike>> = {
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

  const fractionalDigits: Record<Temporal.TimeUnit, FractionalDigit> = {
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 3,
    microsecond: 6,
    nanosecond: 9,
  };

  const payload = resets[unit] ?? {};
  const result = source.with(payload);
  const digits = fractionalDigits[unit];

  return typeof digits === "number"
    ? result.toString({
        fractionalSecondDigits: digits,
      })
    : result.toString();
}
