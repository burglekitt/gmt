import { Temporal } from "@js-temporal/polyfill";

// a function that returns the unit requested
export function parseZonedUnit(
  value: string,
  unit:
    | "year"
    | "month"
    | "day"
    | "hour"
    | "minute"
    | "second"
    | "millisecond"
    | "timezone",
): string {
  const zonedDateTime = Temporal.ZonedDateTime.from(value);

  switch (unit) {
    case "year":
      return zonedDateTime.year.toString();
    case "month":
      return zonedDateTime.month.toString().padStart(2, "0");
    case "day":
      return zonedDateTime.day.toString().padStart(2, "0");
    case "hour":
      return zonedDateTime.hour.toString().padStart(2, "0");
    case "minute":
      return zonedDateTime.minute.toString().padStart(2, "0");
    case "second":
      return zonedDateTime.second.toString().padStart(2, "0");
    case "millisecond":
      return zonedDateTime.millisecond.toString().padStart(3, "0");
    case "timezone":
      return zonedDateTime.timeZoneId;
  }
}
