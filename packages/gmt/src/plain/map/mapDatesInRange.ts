import { Temporal } from "@js-temporal/polyfill";

export function mapDatesInRange(
  startDate: string,
  endDate: string,
  stepDays = 1,
): string[] {
  if (!Number.isInteger(stepDays) || stepDays <= 0) {
    throw new RangeError("stepDays must be a positive integer");
  }

  const start = Temporal.PlainDate.from(startDate);
  const end = Temporal.PlainDate.from(endDate);

  if (Temporal.PlainDate.compare(start, end) === 1) {
    return [];
  }

  const result: string[] = [];
  for (
    let current = start;
    Temporal.PlainDate.compare(current, end) <= 0;
    current = current.add({ days: stepDays })
  ) {
    result.push(current.toString());
  }

  return result;
}
