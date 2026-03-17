import { Temporal } from "@js-temporal/polyfill";

// given an ISO 8601 zoned datetime it returns the date portion
export function parseZonedDate(value: string): string {
  return Temporal.ZonedDateTime.from(value).toPlainDate().toString();
}
