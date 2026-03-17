import { Temporal } from "@js-temporal/polyfill";

export function isValidZonedDateTime(value: string): boolean {
  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime.timeZoneId.length > 0;
  } catch {
    return false;
  }
}
