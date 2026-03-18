import { Temporal } from "@js-temporal/polyfill";
import { isValidDate, isValidDateUnit } from "../validate";

export function subtractDate(
  value: string,
  amount: number,
  unit: Temporal.DateUnit,
): string {
  const validDate = isValidDate(value);
  const validUnit = isValidDateUnit(unit);
  const validAmount = typeof amount === "number" && !Number.isNaN(amount);

  if (!validDate || !validUnit || !validAmount) {
    return "";
  }

  const date = Temporal.PlainDate.from(value);

  switch (unit) {
    case "year":
      return date.subtract({ years: amount }).toString();
    case "month":
      return date.subtract({ months: amount }).toString();
    case "week":
      return date.subtract({ weeks: amount }).toString();
    case "day":
      return date.subtract({ days: amount }).toString();
  }
}
