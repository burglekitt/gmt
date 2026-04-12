import { convertUnixToZoned } from "../unix/convert/convertUnixToZoned";
import type { UnixUnit } from "../unix/validate/isValidUnixUnit";

/**
 * @deprecated will be removed in v2.0.0 - use convertUnixToZoned instead with system timeZone
 * Convert a unix epoch value to a zoned ISO 8601 datetime string.
 *
 * - `value` is a numeric epoch in either milliseconds (default) or seconds.
 * - `timeZone` is an IANA timeZone id.
 * - When `unit` is omitted milliseconds are assumed.
 * - Returns an empty string "" for invalid inputs.
 *
 * @param value epoch value in milliseconds or seconds
 * @param timeZone IANA timeZone identifier
 * @param unit optional unit, "seconds" or "milliseconds"
 * @example convertUnixToTimezone(1700000000000, "America/New_York") // "2023-11-14T10:13:20-05:00[America/New_York]"
 * @returns zoned ISO 8601 string or empty string when invalid
 */
export function convertUnixToTimezone(
  value: number,
  timeZone: string,
  ...unitInput: [unit?: UnixUnit]
): string {
  if (!warned) {
    // eslint-disable-next-line no-console
    console.warn(
      "`convertUnixToTimezone` is deprecated and will be removed in v2.0.0. Use `convertUnixToZoned` instead.",
    );
    warned = true;
  }

  if (unitInput.length === 0) {
    return convertUnixToZoned(value, timeZone);
  }

  return convertUnixToZoned(value, timeZone, unitInput[0]);
}

let warned = false;
