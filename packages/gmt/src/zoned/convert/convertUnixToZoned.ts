import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { isValidTimezone } from "../validate";
import type { UnixUnit } from "./convertZonedToUnix";

function isValidUnixUnit(unit: string): unit is UnixUnit {
  return unit === "seconds" || unit === "milliseconds";
}

export function convertUnixToZoned(
  value: number,
  timeZone: string,
  ...unitInput: [unit?: UnixUnit]
): string {
  /**
   * Convert a unix epoch value to a zoned ISO 8601 datetime string in the
   * specified `timeZone`.
   *
   * - `value` is milliseconds by default, or seconds when `unit` is "seconds".
   * - Returns empty string "" for invalid inputs (amount, timezone, or unit).
   *
   * @param value epoch value
   * @param timeZone IANA timezone identifier
   * @param unit optional unit, "seconds" or "milliseconds"
   * @returns zoned ISO 8601 string or empty string when invalid
   */
  const resolvedUnit = unitInput.length === 0 ? "milliseconds" : unitInput[0];

  if (
    !isValidAmount(value) ||
    !isValidTimezone(timeZone) ||
    !isValidUnixUnit(resolvedUnit ?? "")
  ) {
    return "";
  }

  try {
    const instant = Temporal.Instant.fromEpochMilliseconds(
      resolvedUnit === "seconds" ? value * 1000 : value,
    );

    return instant.toZonedDateTimeISO(timeZone).toString();
  } catch {
    return "";
  }
}
