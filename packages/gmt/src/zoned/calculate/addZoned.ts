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

export function addZoned(
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
    return zoned.add({ [unit]: amount })?.toString() || "";
  } catch {
    return "";
  }
}
