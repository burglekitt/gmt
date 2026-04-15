import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Extracts the IANA timeZone identifier from an ISO 8601 zoned datetime string.
 *
 * @param value - ISO 8601 zoned datetime string
 * @returns IANA timeZone id (e.g. `Europe/Paris`) or an empty string for invalid input
 * 
 * @example chopZonedDateTime("2024-02-29T12:30:45+01:00[Europe/Paris]") // "Europe/Paris"
 * @example chopZonedDateTime("invalid") // ""
 */
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
