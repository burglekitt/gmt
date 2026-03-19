import { Temporal } from "@js-temporal/polyfill";
import { isValidDateTime, isValidDateTimeUnit } from "../validate";
import { isValidAmount } from "../validate/isValidAmount";

export function subtractDateTime(
  value: string,
  amount: number,
  unit: Temporal.DateTimeUnit,
): string {
  const validDateTime = isValidDateTime(value);
  const validUnit = isValidDateTimeUnit(unit);
  const validAmount = isValidAmount(amount);

  if (!validDateTime || !validUnit || !validAmount) {
    return "";
  }

  const dateTime = Temporal.PlainDateTime.from(value);

  return dateTime.subtract({ [unit]: amount }).toString();
}
