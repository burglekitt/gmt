import { Temporal } from "@js-temporal/polyfill";

type ZonedUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export function subtractZoned(
  value: string,
  amount: number,
  unit: ZonedUnit,
): string {
  const zoned = Temporal.ZonedDateTime.from(value);

  switch (unit) {
    case "year":
      return zoned.subtract({ years: amount }).toString();
    case "month":
      return zoned.subtract({ months: amount }).toString();
    case "week":
      return zoned.subtract({ weeks: amount }).toString();
    case "day":
      return zoned.subtract({ days: amount }).toString();
    case "hour":
      return zoned.subtract({ hours: amount }).toString();
    case "minute":
      return zoned.subtract({ minutes: amount }).toString();
    case "second":
      return zoned.subtract({ seconds: amount }).toString();
    case "millisecond":
      return zoned.subtract({ milliseconds: amount }).toString();
  }
}
