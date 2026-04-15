import { Temporal } from "@js-temporal/polyfill";
import { calculateWeekOfYear } from "../../internal/calculateWeekOfYear";
import { getSystemTimeZone } from "./getSystemTimeZone";

/**
 * Get the ISO week number of the current date.
 *
 * @returns The ISO week number (1-53), or null if timezone unavailable
 *
 * @param weekStartsOnArg Optional override for week starting day ("monday" or "sunday").
 * @example getWeekOfYear() // 15 (example output)
 * @example getWeekOfYear("monday") // 15 (example output)
 * @example getWeekOfYear("sunday") // 14 (example output)
 * @example getWeekOfYear() // null (when system timeZone unavailable)
 */
export function getWeekOfYear(
  weekStartsOnArg?: "monday" | "sunday",
): number | null {
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return null;
  }

  try {
    const now = Temporal.Now.plainDateTimeISO(timeZone);
    const date = Temporal.PlainDate.from({
      year: now.year,
      month: now.month,
      day: now.day,
    });

    return calculateWeekOfYear(date, weekStartsOnArg);
  } catch {
    return null;
  }
}
