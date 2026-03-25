import { Temporal } from "@js-temporal/polyfill";
import { endOfDateTime } from "../../plain/calculate/endOfDateTime";
import type { FractionalDigit } from "../../types";
import { isValidZonedDateTime } from "../validate";

/**
 * Return the end of the specified date-time `unit` (year|month|day|hour|minute|...)
 * for a given zoned ISO 8601 datetime string.
 * - Uses Temporal.ZonedDateTime.startOf to compute the result.
 * - Returns an empty string "" for invalid inputs or units.
 *
 * @param value zoned ISO 8601 datetime string
 * @param unit Temporal.DateUnit|Temporal.TimeUnit to specify the unit for the end (e.g. "month")
 * @example endOfZoned("2024-02-29T12:34:56+00:00[UTC]", "month") => "2024-02-29T23:59:59.999999999+00:00[UTC]"
 * @returns zoned ISO 8601 string representing the end of the specified unit, or empty string on invalid input
 */
export function endOfZoned(
  value: string,
  unit: Temporal.DateUnit | Temporal.TimeUnit,
): string {
  const validZonedDateTime = isValidZonedDateTime(value);

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

  if (!validZonedDateTime || !supported.includes(unit)) return "";

  try {
    const zoned = Temporal.ZonedDateTime.from(value);
    const localPlain = zoned.toPlainDateTime().toString();
    const plainEnd = endOfDateTime(
      localPlain,
      unit as Temporal.DateUnit | Temporal.TimeUnit,
    );
    if (!plainEnd) return "";
    const plain = Temporal.PlainDateTime.from(plainEnd);
    const digitsMap: Record<string, FractionalDigit> = {
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
    const digits = (digitsMap[unit as string] ?? 0) as FractionalDigit;
    const out = Temporal.ZonedDateTime.from({
      year: plain.year,
      month: plain.month,
      day: plain.day,
      hour: plain.hour,
      minute: plain.minute,
      second: plain.second,
      millisecond: plain.millisecond,
      microsecond: plain.microsecond,
      nanosecond: plain.nanosecond,
      timeZone: zoned.timeZoneId,
    });
    return out.toString({ fractionalSecondDigits: digits as FractionalDigit });
  } catch {
    return "";
  }
}

export default endOfZoned;
