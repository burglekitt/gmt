import { Temporal } from "@js-temporal/polyfill";

import { isValidDateTime } from "../validate";

/**
 * Return the quarter of the year (1-4) for a given ISO datetime.
 *
 * - Validates input using isValidDateTime.
 * - Computes quarter from month: Q1 = months 1-3, Q2 = months 4-6, Q3 = months 7-9, Q4 = months 10-12.
 * - Returns null for invalid inputs.
 *
 * @param value ISO PlainDateTime string
 * @returns number (1-4) or null for invalid input
 */
export function getQuarterForDateTime(value: string): number | null {
  if (!isValidDateTime(value)) {
    return null;
  }

  try {
    const dateTime = Temporal.PlainDateTime.from(value);
    return Math.floor((dateTime.month - 1) / 3) + 1;
  } catch {
    return null;
  }
}
