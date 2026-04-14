import { Temporal } from "@js-temporal/polyfill";
import { isWeekStartsOn } from "../../internal/isWeekStartsOn";
import { getSystemTimeZone } from "./getSystemTimeZone";

export function getWeekOfYear(
  weekStartsOnArg?: "monday" | "sunday",
): number | null {
  const weekStartsOn = isWeekStartsOn(weekStartsOnArg)
    ? weekStartsOnArg
    : "monday";
  const timeZone = getSystemTimeZone();
  if (!timeZone) {
    return null;
  }

  const now = Temporal.Now.plainDateTimeISO(timeZone);
  const date = Temporal.PlainDate.from({
    year: now.year,
    month: now.month,
    day: now.day,
  });

  // Get the day of the year (1-366)
  const dayOfYear = date.dayOfYear;

  // Get the weekday (1-7, where 1 is Monday and 7 is Sunday)
  const dayOfWeek = date.dayOfWeek;

  // Calculate the offset based on the start of the week
  const offset = weekStartsOn === "monday" ? dayOfWeek - 1 : dayOfWeek % 7;

  // Calculate the week number
  const weekNumber = Math.ceil((dayOfYear + offset) / 7);

  return weekNumber;
}
