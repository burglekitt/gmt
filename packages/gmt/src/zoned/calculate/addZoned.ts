import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

type ZonedUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

export function addZoned(
  value: string,
  amount: number,
  unit: ZonedUnit,
): string {
  const validAmount = typeof amount === "number" && !Number.isNaN(amount);

  if (!isValidZonedDateTime(value) || !validAmount) {
    return "";
  }

  let zoned: Temporal.ZonedDateTime;
  try {
    zoned = Temporal.ZonedDateTime.from(value);
  } catch {
    return "";
  }

  switch (unit) {
    case "year":
      return zoned.add({ years: amount }).toString();
    case "month":
      return zoned.add({ months: amount }).toString();
    case "week":
      return zoned.add({ weeks: amount }).toString();
    case "day":
      return zoned.add({ days: amount }).toString();
    case "hour":
      return zoned.add({ hours: amount }).toString();
    case "minute":
      return zoned.add({ minutes: amount }).toString();
    case "second":
      return zoned.add({ seconds: amount }).toString();
    case "millisecond":
      return zoned.add({ milliseconds: amount }).toString();
    default:
      return "";
  }
}
