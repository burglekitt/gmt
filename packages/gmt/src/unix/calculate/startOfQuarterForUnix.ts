import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { convertZonedToUnix } from "../../zoned/convert";
import { convertUnixToZoned } from "../convert";

export function startOfQuarterForUnix(
  value: string | number,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
  },
): string {
  const epochUnit = options?.epochUnit ?? "milliseconds";
  const timeZone = options?.timeZone ?? getSystemTimezone();

  if (!timeZone) return "";

  const numValue = typeof value === "string" ? Number(value) : value;
  if (
    !Number.isFinite(numValue) ||
    !Number.isInteger(numValue) ||
    numValue < 0
  ) {
    return "";
  }

  try {
    const zoned = convertUnixToZoned(numValue, timeZone, epochUnit);
    if (!zoned) return "";

    const zdt = Temporal.ZonedDateTime.from(zoned);
    const month = zdt.month;
    const quarterStartMonth = Math.floor((month - 1) / 3) * 3 + 1;

    const result = zdt
      .with({
        month: quarterStartMonth,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toString();

    const epoch = convertZonedToUnix(result, epochUnit);
    return epoch?.toString() ?? "";
  } catch {
    return "";
  }
}
