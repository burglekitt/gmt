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

export function addDateTime(
  value: string,
  amount: number,
  unit: DateTimeUnit,
): string {
  const dateTime = Temporal.PlainDateTime.from(value);

  switch (unit) {
    case "year":
      return dateTime.add({ years: amount }).toString();
    case "month":
      return dateTime.add({ months: amount }).toString();
    case "week":
      return dateTime.add({ weeks: amount }).toString();
    case "day":
      return dateTime.add({ days: amount }).toString();
    case "hour":
      return dateTime.add({ hours: amount }).toString();
    case "minute":
      return dateTime.add({ minutes: amount }).toString();
    case "second":
      return dateTime.add({ seconds: amount }).toString();
    case "millisecond":
      return dateTime.add({ milliseconds: amount }).toString();
  }
}
