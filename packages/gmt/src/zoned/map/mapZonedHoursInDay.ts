import { Temporal } from "@js-temporal/polyfill";

export function mapZonedHoursInDay(anchor: string): string[] {
  const start = Temporal.ZonedDateTime.from(anchor).with({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  });
  const nextDay = start.add({ days: 1 });

  const result: string[] = [];
  for (
    let current = start;
    Temporal.Instant.compare(current.toInstant(), nextDay.toInstant()) < 0;
    current = current.add({ hours: 1 })
  ) {
    result.push(current.toString());
  }

  return result;
}
