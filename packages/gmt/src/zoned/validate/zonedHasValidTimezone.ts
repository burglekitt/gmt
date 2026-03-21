import { Temporal } from "@js-temporal/polyfill";

export function zonedHasValidTimezone(value: string): boolean {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime.timeZoneId.length > 0;
  } catch {
    return false;
  }
}
