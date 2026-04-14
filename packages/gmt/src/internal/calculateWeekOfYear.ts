import type { Temporal } from "@js-temporal/polyfill";
import { isWeekStartsOn } from "./isWeekStartsOn";

export function calculateWeekOfYear(
  date: Temporal.PlainDate,
  weekStartsOnArg?: "monday" | "sunday",
): number {
  const weekStartsOn = isWeekStartsOn(weekStartsOnArg)
    ? weekStartsOnArg
    : "monday";
  const dayOfYear = date.dayOfYear;
  const dayOfWeek = date.dayOfWeek;
  const offset = weekStartsOn === "monday" ? dayOfWeek - 1 : dayOfWeek % 7;
  return Math.ceil((dayOfYear + offset) / 7);
}
