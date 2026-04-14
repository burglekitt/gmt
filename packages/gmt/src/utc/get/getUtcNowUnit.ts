import { Temporal } from "@js-temporal/polyfill";
import { isValidDateTimeUnit } from "../../plain/validate";
import type { DateTimeUnit } from "../../types";

type UtcNowUnit = DateTimeUnit | "dayOfWeek";

function isValidUtcNowUnit(unit: string): unit is UtcNowUnit {
  return isValidDateTimeUnit(unit) || ["dayOfWeek"].includes(unit);
}

/**
 * Return the requested unit value from the current UTC instant.
 *
 * - Uses the current UTC instant.
 * - Returns an empty string on invalid unit.
 *
 * @param unit unit to extract from current utc instant
 * @returns string representation of the requested unit or "" when invalid
 */
export function getUtcNowUnit(unit: UtcNowUnit): string {
  if (!isValidUtcNowUnit(String(unit ?? ""))) return "";

  const now = Temporal.Now.instant().toZonedDateTimeISO("UTC");
  const plainDateTime = now.toPlainDateTime();

  switch (unit) {
    case "year":
      return plainDateTime.year.toString();
    case "month":
      return plainDateTime.month.toString().padStart(2, "0");
    case "week": {
      return "";
    }
    case "day":
      return plainDateTime.day.toString().padStart(2, "0");
    case "dayOfWeek":
      return now.dayOfWeek.toString();
    case "hour":
      return plainDateTime.hour.toString().padStart(2, "0");
    case "minute":
      return plainDateTime.minute.toString().padStart(2, "0");
    case "second":
      return plainDateTime.second.toString().padStart(2, "0");
    case "millisecond":
      return plainDateTime.millisecond.toString().padStart(3, "0");
    case "microsecond":
      return (plainDateTime.microsecond ?? 0).toString().padStart(3, "0");
    case "nanosecond":
      return (plainDateTime.nanosecond ?? 0).toString().padStart(3, "0");
    default:
      return "";
  }
}
