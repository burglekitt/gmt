import { Temporal } from "@js-temporal/polyfill";

export function mapDaysInMonth(month: string): string[] {
  const yearMonth = Temporal.PlainYearMonth.from(month);
  const daysInMonth = yearMonth.daysInMonth;

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = (index + 1).toString().padStart(2, "0");
    return `${yearMonth.toString()}-${day}`;
  });
}
