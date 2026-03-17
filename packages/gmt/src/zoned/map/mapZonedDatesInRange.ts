import { Temporal } from "@js-temporal/polyfill";

export function mapZonedDatesInRange(
  startZonedDateTime: string,
  endZonedDateTime: string,
  stepDays = 1,
): string[] {
  if (!Number.isInteger(stepDays) || stepDays <= 0) {
    throw new RangeError("stepDays must be a positive integer");
  }

  const start = Temporal.ZonedDateTime.from(startZonedDateTime);
  const end = Temporal.ZonedDateTime.from(endZonedDateTime);

  if (start.timeZoneId !== end.timeZoneId) {
    throw new RangeError("Both values must use the same time zone");
  }

  const startDate = start.toPlainDate();
  const endDate = end.toPlainDate();

  if (Temporal.PlainDate.compare(startDate, endDate) === 1) {
    return [];
  }

  const result: string[] = [];
  for (
    let current = startDate;
    Temporal.PlainDate.compare(current, endDate) <= 0;
    current = current.add({ days: stepDays })
  ) {
    result.push(current.toString());
  }

  return result;
}
