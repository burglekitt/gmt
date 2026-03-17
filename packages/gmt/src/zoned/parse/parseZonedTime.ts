import { Temporal } from "@js-temporal/polyfill";
// given an ISO 8601 zoned datetime it returns the time portion
export function parseZonedTime(value: string): string {
  return Temporal.ZonedDateTime.from(value).toPlainTime().toString();
}
