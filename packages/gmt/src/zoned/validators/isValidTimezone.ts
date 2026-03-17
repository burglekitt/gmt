// function that uses Temporal polyfill and validates if the passed string is a valid IANA timezone

import { Temporal } from "@js-temporal/polyfill";

export function isValidTimeZone(timeZone: string): boolean {
  try {
    Temporal.ZonedDateTime.from({
      year: 2020,
      month: 2,
      day: 28,
      hour: 0,
      minute: 0,
      second: 0,
      timeZone,
    });
    return true;
  } catch {
    return false;
  }
}
