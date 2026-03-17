import { Temporal } from "@js-temporal/polyfill";

type DateTimeUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export function subtractDateTime(
  value: string,
  amount: number,
  unit: DateTimeUnit,
): string {
  const dateTime = Temporal.PlainDateTime.from(value);

  switch (unit) {
    case "year":
      return dateTime.subtract({ years: amount }).toString();
    case "month":
      return dateTime.subtract({ months: amount }).toString();
    case "week":
      return dateTime.subtract({ weeks: amount }).toString();
    case "day":
      return dateTime.subtract({ days: amount }).toString();
    case "hour":
      return dateTime.subtract({ hours: amount }).toString();
    case "minute":
      return dateTime.subtract({ minutes: amount }).toString();
    case "second":
      return dateTime.subtract({ seconds: amount }).toString();
    case "millisecond":
      return dateTime.subtract({ milliseconds: amount }).toString();
  }
}
