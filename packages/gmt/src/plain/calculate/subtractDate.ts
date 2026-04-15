import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import type { DateDurationUnit } from "../../types";
import { isValidDate, isValidDateDurationUnit } from "../validate";

/**
 * Return a PlainDate ISO string with `amount` subtracted according to `unit`.
 *
 * @param value ISO PlainDate string
 * @param units Partial<Record<DateDurationUnit, number>> object specifying units to subtract (e.g. { day: 1, month: 2 })
 * @returns ISO PlainDate string after subtraction, or "" on invalid input
 * \
 * @example subtractDate("2024-03-15", { day: 5 }) // "2024-03-10"
 * @example subtractDate("2024-03-15", { month: 1, year: 1 }) // "2023-02-15"
 * @example subtractDate("invalid", { day: 5 }) // ""
 * @example subtractDate("2024-03-15", { invalidUnit: 5 }) // ""
 * @example subtractDate("2024-03-15", { day: -5 }) // "2024-03-20"
 * @example subtractDate("2024-03-15", { day: 5.5 }) // "" (invalid amount)
 */
export function subtractDate(
  value: string,
  units: Partial<Record<DateDurationUnit, number>>,
): string {
  const validDate = isValidDate(value);
  const validUnits = Object.keys(units).every(isValidDateDurationUnit);
  const validAmounts = Object.values(units).every(isValidAmount);

  if (!validDate || !validUnits || !validAmounts) {
    return "";
  }

  try {
    const date = Temporal.PlainDate.from(value);
    return date.subtract(units).toString();
  } catch {
    return "";
  }
}
