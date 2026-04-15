import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { getSystemTimeZone } from "../../plain/get";
import { convertUnixToZoned } from "../../unix/convert";

/**
 * Extract the date portion from a unix epoch value.
 *
 * @param value unix epoch in milliseconds or seconds (number)
 * @param options optional: epochUnit ("seconds" | "milliseconds"), timeZone (IANA)
 * @returns ISO date string (e.g., "2024-03-17") or "" on invalid input
 *
 * @example parseUnixDate(1700000000000) // "2023-11-15"
 * @example parseUnixDate(1700000000, { epochUnit: "seconds" }) // "2023-11-15"
 * @example parseUnixDate(-1) // ""
 */
export function parseUnixDate(
  value: number,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
  },
): string {
  const { epochUnit = "milliseconds", timeZone = getSystemTimeZone() } =
    options ?? {};

  if (!isValidAmount(value)) return "";

  if (!timeZone) return "";

  const zoned = epochUnit
    ? convertUnixToZoned(value, timeZone, epochUnit)
    : convertUnixToZoned(value, timeZone);
  if (!zoned) return "";

  try {
    const zdt = Temporal.ZonedDateTime.from(zoned);
    return zdt.toPlainDate().toString();
  } catch {
    return "";
  }
}
