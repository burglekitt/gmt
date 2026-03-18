import { Temporal } from "@js-temporal/polyfill";
import { isValidDateTime, isValidDateTimeUnit } from "../validate";

export function diffDateTime(
  dateTime1: string,
  dateTime2: string,
  unit: Temporal.DateTimeUnit,
): number | null {
  const validDateTimes =
    isValidDateTime(dateTime1) && isValidDateTime(dateTime2);
  const validUnit = isValidDateTimeUnit(unit);

  if (!validDateTimes || !validUnit) {
    return null;
  }

  const dt1 = Temporal.PlainDateTime.from(dateTime1);
  const dt2 = Temporal.PlainDateTime.from(dateTime2);

  const duration = dt1.until(dt2, { largestUnit: unit });

  switch (unit) {
    case "year":
      return duration.years;
    case "month":
      return duration.months;
    case "week":
      return duration.weeks;
    case "day":
      return duration.days;
    case "hour":
      return duration.hours;
    case "minute":
      return duration.minutes;
    case "second":
      return duration.seconds;
    case "millisecond":
      return duration.milliseconds;
    case "microsecond":
      return duration.microseconds;
    case "nanosecond":
      return duration.nanoseconds;
    default:
      return null;
  }
}
