import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

// function returns IANA timezone

export function chopZonedDateTime(value: string): string {
  const validZonedDateTime = isValidZonedDateTime(value);
  if (!validZonedDateTime) return "";
  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime.timeZoneId;
  } catch {
    return "";
  }
}
