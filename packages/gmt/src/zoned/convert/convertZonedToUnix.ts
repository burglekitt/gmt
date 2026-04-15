import { Temporal } from "@js-temporal/polyfill";
import {
  isValidUnixUnit,
  type UnixUnit,
} from "../../unix/validate/isValidUnixUnit";
import { isValidZonedDateTime } from "../validate";

/**
 * Convert an ISO 8601 zoned datetime string to a unix epoch value in
 * milliseconds (default) or seconds.
 *
 * - Returns `null` for invalid zoned datetime or invalid unit.
 *
 * @param value zoned ISO 8601 datetime string
 * @param unit optional unit, "seconds" or "milliseconds"
 * @example convertZonedToUnix("2024-02-29T12:34:56.789+00:00[UTC]") // 1709200496789 (milliseconds)
 * @example convertZonedToUnix("2024-02-29T12:34:56.789+00:00[UTC]", "milliseconds") // 1709200496789
 * @example convertZonedToUnix("2024-02-29T12:34:56.789+00:00[UTC]", "seconds") // 1709200496
 * @example convertZonedToUnix("invalid", "seconds") // null (invalid zoned datetime)
 * @example convertZonedToUnix("2024-02-29T12:34:56.789+00:00[UTC]", "invalidUnit") // null (invalid unit)
 * @returns epoch number or null when invalid
 */
export function convertZonedToUnix(
  value: string,
  ...unitInput: [unit?: UnixUnit]
): number | null {
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
