import { Temporal } from "@js-temporal/polyfill";
import { calculateWeekOfYear } from "../../internal/calculateWeekOfYear";
import { getSystemTimeZone } from "./getSystemTimeZone";

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
