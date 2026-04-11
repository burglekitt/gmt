import { Temporal } from "@js-temporal/polyfill";

import { isValidDate } from "../validate";

/**
 * Return the last day of the quarter for a given ISO date.
 *
 * - Validates input using isValidDate.
 * - Returns an empty string for invalid inputs.
 *
 * @param value ISO PlainDate string
 * @returns ISO PlainDate string for the last day of the quarter, or empty string on invalid input
 */
export function endOfQuarterForDate(value: string): string {
  if (!isValidDate(value)) {
    return "";
  }

  try {
    const date = Temporal.PlainDate.from(value);
    const month = date.month;
    const quarterEndMonth = Math.floor((month - 1) / 3) * 3 + 3;

    const quarterStart = date.with({ month: quarterEndMonth, day: 1 });
    const nextQuarterStart = quarterStart.add({ months: 1 });
    return nextQuarterStart.subtract({ days: 1 }).toString();
  } catch {
    return "";
  }
}
