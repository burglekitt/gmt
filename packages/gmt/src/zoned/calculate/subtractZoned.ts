import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../plain/validate/isValidAmount";
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

export function subtractZoned(
  value: string,
  amount: number,
  unit: ZonedUnit,
): string {
  const validAmount = isValidAmount(amount);

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
    default:
      return "";
  }
}
