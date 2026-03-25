import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import type { DateTimeUnits } from "../../types";
import { isValidDateTime, isValidDateTimeUnit } from "../validate";

/**
 * Return a PlainDateTime ISO string with `amount` added according to `unit`.
 *
 * - Validates `value`, `unit`, and `amount` before performing the add.
 * - Returns an empty string for invalid inputs.
 *
 * @param value ISO PlainDateTime string
 * @param units Partial<Record<DateTimeUnits, number>> object specifying units to add (e.g. { days: 1, months: 2 })
 * @returns ISO PlainDateTime string after addition, or "" on invalid input
 */
export function addDateTime(
  value: string,
  units: Partial<Record<DateTimeUnits, number>>,
): string {
  const validDateTime = isValidDateTime(value);
  const validUnits = Object.keys(units).every((unit) =>
    isValidDateTimeUnit(unit),
  );
  const validAmounts = Object.values(units).every((amount) =>
    isValidAmount(amount),
  );

  if (!validDateTime || !validUnits || !validAmounts) {
    return "";
  }

  const dateTime = Temporal.PlainDateTime.from(value);

  return dateTime.add(units).toString();
}
