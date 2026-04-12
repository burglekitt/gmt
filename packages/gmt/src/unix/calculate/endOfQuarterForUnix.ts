import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { convertZonedToUnix } from "../../zoned/convert";
import { convertUnixToZoned } from "../convert";

export function endOfQuarterForUnix(
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
    const quarterEndMonth = Math.floor((month - 1) / 3) * 3 + 3;

    const quarterStart = zdt.with({
      month: quarterEndMonth,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });
    const nextQuarterStart = quarterStart.add({ months: 1 });
    const lastDayOfQuarter = nextQuarterStart.subtract({ days: 1 });

    const result = lastDayOfQuarter
      .with({ hour: 23, minute: 59, second: 59, nanosecond: 999999999 })
      .toString();

    const epoch = convertZonedToUnix(result, epochUnit);
    return epoch?.toString() ?? "";
  } catch {
    return "";
  }
}
