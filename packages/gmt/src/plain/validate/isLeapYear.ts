import { Temporal } from "@js-temporal/polyfill";

/**
 * Return true when the given PlainDate falls in a leap year.
 *
 *
 * @param value ISO PlainDate string
 * @returns boolean indicating whether the date is in a leap year
 * 
 * @example isLeapYear("2024-03-15") // true
 * @example isLeapYear("2023-03-15") // false
 * @example isLeapYear("invalid") // false 
 */
export function isLeapYear(value: string): boolean {
  try {
    const date = Temporal.PlainDate.from(value);
    return date.inLeapYear;
  } catch {
    return false;
  }
}
