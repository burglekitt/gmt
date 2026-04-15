import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

export type ZonedParseUnit =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond"
  | "nanosecond"
  | "timeZone";

  // TODO is duplicated
  
function isValidZonedUnit(unit: string): unit is ZonedParseUnit {
  return [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond",
    "nanosecond",
    "timeZone",
  ].includes(unit);
}

/**
 * Return the requested unit value from an ISO 8601 zoned datetime string.
 *
 * @param value zoned ISO 8601 datetime string
 * @param unit unit to extract
 * @returns string representation of the requested unit or "" when invalid
 *
 * @example parseZonedUnit("2024-02-29T12:34:56.789+00:00[UTC]", "year") // "2024"
 * @example parseZonedUnit("invalid", "year") // ""
 */
export function parseZonedUnit(value: string, unit: ZonedParseUnit): string {
  if (!isValidZonedDateTime(value) || !isValidZonedUnit(unit)) {
    return "";
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);

    switch (unit) {
      case "year":
        return zonedDateTime.year.toString();
      case "month":
        return zonedDateTime.month.toString().padStart(2, "0");
      case "day":
        return zonedDateTime.day.toString().padStart(2, "0");
      case "hour":
        return zonedDateTime.hour.toString().padStart(2, "0");
      case "minute":
        return zonedDateTime.minute.toString().padStart(2, "0");
      case "second":
        return zonedDateTime.second.toString().padStart(2, "0");
      case "millisecond":
        return zonedDateTime.millisecond.toString().padStart(3, "0");
      case "nanosecond":
        return zonedDateTime.nanosecond.toString().padStart(3, "0");
      case "timeZone":
        return zonedDateTime.timeZoneId;
      default:
        return "";
    }
  } catch {
    return "";
  }
}
