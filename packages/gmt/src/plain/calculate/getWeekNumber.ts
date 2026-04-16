import { Temporal } from "@js-temporal/polyfill";

/**
 * Calculate the week number based on configurable week start day.
 *
 * - ISO (monday): Week 1 is the week containing the first Thursday (has at least 4 days in the year)
 * - US (sunday): Week 1 is the week containing Jan 1 (first week has at least 1 day)
 *
 * @param date PlainDate to calculate week number for
 * @param weekStartsOn "monday" or "sunday"
 * @returns Week number (1-53), or 0 if invalid
 */
export function getWeekNumber(
  date: Temporal.PlainDate,
  weekStartsOn: "monday" | "sunday",
): number {
  if (weekStartsOn === "monday") {
    const isoWeek = date.weekOfYear;
    return isoWeek ?? 0;
  }

  const yearStart = Temporal.PlainDate.from({
    year: date.year,
    month: 1,
    day: 1,
  });

  const firstDayOfWeek = yearStart.dayOfWeek;
  const daysSinceSunday = firstDayOfWeek === 7 ? 0 : firstDayOfWeek + 1;
  const daysSinceJan1 = date.dayOfYear - 1;
  const weeksSinceJan1 = daysSinceJan1 - daysSinceSunday;
  const result = Math.floor(weeksSinceJan1 / 7) + 1;
  return result < 1 ? 1 : result;
}
