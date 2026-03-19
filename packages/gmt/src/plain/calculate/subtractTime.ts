import { Temporal } from "@js-temporal/polyfill";
import { isValidTime, isValidTimeUnit } from "../validate";
import { isValidAmount } from "../validate/isValidAmount";

export function subtractTime(
  value: string,
  amount: number,
  unit: Temporal.TimeUnit,
): string {
  const validTime = isValidTime(value);
  const validUnit = isValidTimeUnit(unit);
  const validAmount = isValidAmount(amount);

  if (!validTime || !validUnit || !validAmount) {
    return "";
  }

  const time = Temporal.PlainTime.from(value);

  switch (unit) {
    case "hour":
      return time.subtract({ hours: amount }).toString();
    case "minute":
      return time.subtract({ minutes: amount }).toString();
    case "second":
      return time.subtract({ seconds: amount }).toString();
    case "millisecond":
      return time.subtract({ milliseconds: amount }).toString();
    case "microsecond":
      return time.subtract({ microseconds: amount }).toString();
    case "nanosecond":
      return time.subtract({ nanoseconds: amount }).toString();
  }
}
