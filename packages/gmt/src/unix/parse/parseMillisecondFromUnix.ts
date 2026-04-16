import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimeZone } from "../../plain/get";
import { convertUnixToZoned } from "../convert";
import type { UnixUnit } from "../validate";

/**
 * Return the millisecond (0-999) from a unix epoch value.
 *
 * - Converts to ZonedDateTime then extracts the millisecond.
 * - Returns "" for invalid input.
 *
 * @param value unix epoch in milliseconds or seconds (number or string)
 * @param options optional: epochUnit ("seconds" | "milliseconds"), timeZone (IANA)
 * @returns Millisecond (000-999) or "" on invalid input
 *
 * @example parseMillisecondFromUnix(1700000000000) // "000"
 * @example parseMillisecondFromUnix(-1) // ""
 */
export function parseMillisecondFromUnix(
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
    return zdt.millisecond.toString().padStart(3, "0");
  } catch {
    return "";
  }
}
