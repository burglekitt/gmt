import { Temporal } from "@js-temporal/polyfill";
// given an ISO 8601 zoned datetime it returns the timezone portion
export function parseZonedTimezone(value: string): string {
  return Temporal.ZonedDateTime.from(value).timeZoneId;
}
