import { Temporal } from "@js-temporal/polyfill";

type DateUnit = "year" | "month" | "week" | "day";

export function addDate(value: string, amount: number, unit: DateUnit): string {
  const date = Temporal.PlainDate.from(value);

  switch (unit) {
    case "year":
      return date.add({ years: amount }).toString();
    case "month":
      return date.add({ months: amount }).toString();
    case "week":
      return date.add({ weeks: amount }).toString();
    case "day":
      return date.add({ days: amount }).toString();
  }
}
