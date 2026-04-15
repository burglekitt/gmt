import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { weekOfYear } from "../../plain/calculate";
import { getSystemTimeZone } from "../../plain/get";
import { convertUnixToZoned } from "../../unix/convert";
import type { UnixUnit } from "../validate";

export type PlainNowUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "dayOfWeek"
  | "hour"
  | "minute"
  | "second"
  | "millisecond"
  | "microsecond"
  | "nanosecond";

/**
 * Extract a unit from a unix epoch value.
 *
 * - Valid units: "year", "month", "week", "day", "dayOfWeek", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond".
 * - Converts to ZonedDateTime then extracts the unit.
 * - Returns "" for invalid input.
 *
 * @param value unix epoch in milliseconds or seconds (number or string)
 * @param unit unit to extract (e.g. "year", "month", "hour")
 * @param options optional: epochUnit ("seconds" | "milliseconds"), timeZone (IANA)
 * @returns extracted unit value as string, or "" on invalid input
 *
 * @example parseUnixUnit(1700000000000, "year") // "2023"
 * @example parseUnixUnit(1700000000, "hour", { epochUnit: "seconds" }) // "12"
 * @example parseUnixUnit(-1, "year") // ""
 */
export function parseUnixUnit(
  value: number | string,
  unit: PlainNowUnit,
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
    switch (unit) {
      case "year":
        return zdt.year.toString();
      case "month":
        return zdt.month.toString().padStart(2, "0");
      case "week": {
        const w = weekOfYear(zdt.toPlainDate().toString());
        return w === null ? "" : w.toString();
      }
      case "day":
        return zdt.day.toString().padStart(2, "0");
      case "dayOfWeek":
        return zdt.dayOfWeek.toString();
      case "hour":
        return zdt.hour.toString().padStart(2, "0");
      case "minute":
        return zdt.minute.toString().padStart(2, "0");
      case "second":
        return zdt.second.toString().padStart(2, "0");
      case "millisecond":
        return zdt.millisecond.toString().padStart(3, "0");
      case "microsecond":
        return (zdt.microsecond ?? 0).toString().padStart(3, "0");
      case "nanosecond":
        return (zdt.nanosecond ?? 0).toString().padStart(3, "0");
      default:
        return "";
    }
  } catch {
    return "";
  }
}
