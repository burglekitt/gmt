import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimeZone } from "../../plain/get";
import { convertUnixToZoned } from "../../unix/convert";

/**
 * Extract the time portion from a unix epoch value.
 *
 * @param value unix epoch in milliseconds or seconds (number)
 * @param options optional: epochUnit ("seconds" | "milliseconds"), timeZone (IANA)
 * @returns ISO time string (e.g., "14:30:45") or "" on invalid input
 *
 * @example parseUnixTime(1700000000000) // "04:13:20"
 * @example parseUnixTime(1700000000, { epochUnit: "seconds" }) // "04:13:20"
 * @example parseUnixTime(-1) // ""
 */
export function parseUnixTime(
  value: number,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
  },
): string {
  if (!isValidAmount(value)) return "";

  const timeZone = options?.timeZone ?? getSystemTimeZone();
  if (!timeZone) return "";

  const zoned = options?.epochUnit
    ? convertUnixToZoned(value, timeZone, options.epochUnit)
    : convertUnixToZoned(value, timeZone);
  if (!zoned) return "";

  try {
    const zdt = Temporal.ZonedDateTime.from(zoned);
    return zdt.toPlainTime().toString();
  } catch {
    return "";
  }
}
