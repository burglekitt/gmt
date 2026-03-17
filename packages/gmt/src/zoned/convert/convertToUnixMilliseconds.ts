import { Temporal } from "@js-temporal/polyfill";

export function convertToUnixMilliseconds(value: string): number {
  const zonedDateTime = Temporal.ZonedDateTime.from(value);
  return Number(zonedDateTime.toInstant().epochMilliseconds);
}
