import { Temporal } from "@js-temporal/polyfill";

export function parseDateUnit(
  value: string,
  unit: "year" | "month" | "day",
): string {
  const date = Temporal.PlainDate.from(value);

  switch (unit) {
    case "year":
      return date.year.toString();
    case "month":
      return date.month.toString().padStart(2, "0");
    case "day":
      return date.day.toString().padStart(2, "0");
  }
}
