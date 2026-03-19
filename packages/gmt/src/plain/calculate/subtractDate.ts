import { Temporal } from "@js-temporal/polyfill";
import { isValidDate, isValidDateUnit } from "../validate";
import { isValidAmount } from "../validate/isValidAmount";

export function subtractDate(
  value: string,
  amount: number,
  unit: Temporal.DateUnit,
): string {
  const validDate = isValidDate(value);
  const validUnit = isValidDateUnit(unit);
  const validAmount = isValidAmount(amount);

  if (!validDate || !validUnit || !validAmount) {
    return "";
  }

  const date = Temporal.PlainDate.from(value);

  return date.subtract({ [unit]: amount }).toString();
}
