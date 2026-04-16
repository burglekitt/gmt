import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimeZone } from "../../plain/get";
import { convertUnixToZoned } from "../convert";
import type { UnixUnit } from "../validate";

/**
 * Return the hour (0-23) from a unix epoch value.
 *
 * - Converts to ZonedDateTime then extracts the hour.
 * - Returns "" for invalid input.
 *
 * @param value unix epoch in milliseconds or seconds (number or string)
 * @param options optional: epochUnit ("seconds" | "milliseconds"), timeZone (IANA)
 * @returns Hour (00-23) or "" on invalid input
 *
 * @example parseHourFromUnix(1700000000000) // "05"
 * @example parseHourFromUnix(-1) // ""
 */
export function parseHourFromUnix(
  value: number | string,
  options?: {
    epochUnit?: UnixUnit;
    timeZone?: string;
  },
): string {
  const numValue = typeof value === "string" ? Number(value) : value;
  if (!isValidAmount(numValue)) return "";

  const timeZone = options?.timeZone ?? getSystemTimeZone();
  if (!timeZone) return "";

  const zoned =
    typeof options?.epochUnit === "undefined"
      ? convertUnixToZoned(numValue, timeZone)
      : convertUnixToZoned(numValue, timeZone, options.epochUnit);
  if (!zoned) return "";

  try {
    const zdt = Temporal.ZonedDateTime.from(zoned);
    return zdt.hour.toString().padStart(2, "0");
  } catch {
    return "";
  }
}
