import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import type { DateUnits } from "../../types";
import { isValidDate, isValidDateUnit } from "../validate";

/**
 * Return a PlainDate ISO string with `amount` subtracted according to `unit`.
 *
 * - Validates `value`, `unit`, and `amount` before subtracting.
 * - Returns an empty string for invalid inputs.
 *
 * @param value ISO PlainDate string
 * @param units Partial<Record<DateUnits, number>> object specifying units to subtract (e.g. { day: 1, month: 2 })
 * @returns ISO PlainDate string after subtraction, or "" on invalid input
 */
export function subtractDate(
  value: string,
  units: Partial<Record<DateUnits, number>>,
): string {
  const validDate = isValidDate(value);
  const validUnits = Object.keys(units).every(isValidDateUnit);
  const validAmounts = Object.values(units).every(isValidAmount);

  if (!validDate || !validUnits || !validAmounts) {
    return "";
  }

  const date = Temporal.PlainDate.from(value);

  return date.subtract(units).toString();
}
