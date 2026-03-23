import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

export type UnixUnit = "seconds" | "milliseconds";

function isValidUnixUnit(unit: string): unit is UnixUnit {
  return unit === "seconds" || unit === "milliseconds";
}

export function convertZonedToUnix(
  value: string,
  ...unitInput: [unit?: UnixUnit]
): number | null {
/**
 * Convert an ISO 8601 zoned datetime string to a unix epoch value in
 * milliseconds (default) or seconds.
 *
 * - Returns `null` for invalid zoned datetime or invalid unit.
 *
 * @param value zoned ISO 8601 datetime string
 * @param unit optional unit, "seconds" or "milliseconds"
 * @returns epoch number or null when invalid
 */
  const resolvedUnit = unitInput.length === 0 ? "milliseconds" : unitInput[0];

  if (!isValidZonedDateTime(value) || !isValidUnixUnit(resolvedUnit ?? "")) {
    return null;
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    const milliseconds = Number(zonedDateTime.toInstant().epochMilliseconds);
    return resolvedUnit === "seconds"
      ? Math.floor(milliseconds / 1000)
      : milliseconds;
  } catch {
    return null;
  }
}
