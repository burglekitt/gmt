import { Temporal } from "@js-temporal/polyfill";
import { isLeapSecond } from "../../plain/validate/isLeapSecond";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

/**
 * Parse a zoned datetime and return the plain local datetime portion as an ISO plain datetime string.
 * 
 * @param value zoned ISO 8601 datetime string
 * @returns plain local datetime string or "" when invalid
 *
 * @example parseZonedDateTime("2024-02-29T12:34:56.789+00:00[UTC]") // "2024-02-29T12:34:56.789"
 * @example parseZonedDateTime("invalid") // ""
 */
export const parseZonedDateTime = (value: string): string => {
  if (!isValidZonedDateTime(value) || isLeapSecond(value)) {
    return "";
  }

  try {
    return Temporal.ZonedDateTime.from(value).toPlainDateTime().toString();
  } catch {
    return "";
  }
};
