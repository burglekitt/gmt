import { Temporal } from "@js-temporal/polyfill";

import { isValidZonedDateTime } from "../validate";

export function areZonedDateTimesEqual(
  value1: string,
  value2: string,
): boolean {
  if (!isValidZonedDateTime(value1) || !isValidZonedDateTime(value2)) {
    return false;
  }

  try {
    const zonedDateTime1 = Temporal.ZonedDateTime.from(value1);
    const zonedDateTime2 = Temporal.ZonedDateTime.from(value2);

    return (
      zonedDateTime1.year === zonedDateTime2.year &&
      zonedDateTime1.month === zonedDateTime2.month &&
      zonedDateTime1.day === zonedDateTime2.day &&
      zonedDateTime1.hour === zonedDateTime2.hour &&
      zonedDateTime1.minute === zonedDateTime2.minute &&
      zonedDateTime1.second === zonedDateTime2.second &&
      zonedDateTime1.millisecond === zonedDateTime2.millisecond &&
      zonedDateTime1.microsecond === zonedDateTime2.microsecond &&
      zonedDateTime1.nanosecond === zonedDateTime2.nanosecond &&
      zonedDateTime1.timeZoneId === zonedDateTime2.timeZoneId
    );
  } catch {
    return false;
  }
}
