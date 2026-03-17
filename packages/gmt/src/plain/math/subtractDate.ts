import { Temporal } from "@js-temporal/polyfill";

type DateUnit = "year" | "month" | "week" | "day";

export function subtractDate(
  value: string,
  amount: number,
  unit: DateUnit,
): string {
  const date = Temporal.PlainDate.from(value);

  switch (unit) {
    case "year":
      return date.subtract({ years: amount }).toString();
    case "month":
      return date.subtract({ months: amount }).toString();
    case "week":
      return date.subtract({ weeks: amount }).toString();
    case "day":
      return date.subtract({ days: amount }).toString();
  }
}
