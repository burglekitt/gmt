import { Temporal } from "@js-temporal/polyfill";

import { isValidTime } from "../validate";

/**
 * Return a specific time unit extracted from a PlainTime string.
 *
 * @param value ISO PlainTime string
 * @param unit unit to extract from the time
 * @returns string representation of the requested unit or "" on invalid input
 * 
 * @example parseTimeUnit("14:30:45.123", "hour") // "14"
 * @example parseTimeUnit("14:30:45.123", "minute") // "30"
 * @example parseTimeUnit("14:30:45.123", "second") // "45"
 * @example parseTimeUnit("14:30:45.123", "millisecond") // "123"
 * @example parseTimeUnit("invalid", "hour") // ""
 */
export function parseTimeUnit(
  value: string,
  unit: "hour" | "minute" | "second" | "millisecond",
): string {
  if (!isValidTime(value)) {
    return "";
  }

  try {
    const time = Temporal.PlainTime.from(value);

    switch (unit) {
      case "hour":
        return time.hour.toString().padStart(2, "0");
      case "minute":
        return time.minute.toString().padStart(2, "0");
      case "second":
        return time.second.toString().padStart(2, "0");
      case "millisecond":
        return time.millisecond.toString().padStart(3, "0");
      default:
        return "";
    }
  } catch {
    return "";
  }
}
