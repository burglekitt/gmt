import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import type { DateDurationUnit } from "../../types";
import { isValidDate, isValidDateDurationUnit } from "../validate";

/**
 * Return a PlainDate ISO string with `amount` added according to `unit`.
 *
 *
 * @param value ISO PlainDate string
 * @param units Partial<Record<DateDurationUnit, number>> object specifying units to add (e.g. { day: 1, month: 2 })
 * @returns ISO PlainDate string after addition, or "" on invalid input

 * @example addDate("2024-03-10", { day: 5 }) // "2024-03-15"
 * @example addDate("2024-03-10", { month: 1, year: 1 }) // "2025-04-10"
 * @example addDate("invalid", { day: 5 }) // ""
 * @example addDate("2024-03-10", { invalidUnit: 5 }) // ""
 * @example addDate("2024-03-10", { day: -5 }) // "2024-03-05"
 */
export function addDate(
  value: string /* ISO 8601 date */,
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
    return date.add(units).toString();
  } catch {
    return "";
  }
}
