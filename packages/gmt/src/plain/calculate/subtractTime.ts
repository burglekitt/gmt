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

  return time.subtract({ [unit]: amount }).toString();
}
