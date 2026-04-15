import { Temporal } from "@js-temporal/polyfill";
import { isValidUtc } from "../validate";

/**
 * Extract the date portion from a UTC datetime string.
 *
 * @param value ISO UTC datetime string (e.g., "2024-03-17T14:30:45Z")
 * @returns ISO date string (e.g., "2024-03-17") or "" on invalid input
 *
 * @example parseUtcDate("2024-03-17T14:30:45Z") // "2024-03-17"
 * @example parseUtcDate("invalid") // ""
 */
export function parseUtcDate(value: string): string {
  if (!isValidUtc(value)) {
    return "";
  }

  try {
    const instant = Temporal.Instant.from(value);
    const dateTime = instant.toZonedDateTimeISO("UTC");
    return dateTime.toPlainDate().toString();
  } catch {
    return "";
  }
}
