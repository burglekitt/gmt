import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { convertUnixToZoned } from "../convert";

export function isBetweenUnix(
  value: string | number,
  start: string | number,
  end: string | number,
  options?: {
    epochUnit?: "seconds" | "milliseconds";
    timeZone?: string;
    inclusiveStart?: boolean;
    inclusiveEnd?: boolean;
  },
): boolean {
  const epochUnit = options?.epochUnit ?? "milliseconds";
  const timeZone = options?.timeZone ?? getSystemTimezone();
  const inclusiveStart = options?.inclusiveStart ?? true;
  const inclusiveEnd = options?.inclusiveEnd ?? true;

  if (!timeZone) return false;

  const numValue = typeof value === "string" ? Number(value) : value;
  const numStart = typeof start === "string" ? Number(start) : start;
  const numEnd = typeof end === "string" ? Number(end) : end;

  if (
    !Number.isFinite(numValue) ||
    !Number.isInteger(numValue) ||
    numValue < 0 ||
    !Number.isFinite(numStart) ||
    !Number.isInteger(numStart) ||
    numStart < 0 ||
    !Number.isFinite(numEnd) ||
    !Number.isInteger(numEnd) ||
    numEnd < 0
  ) {
    return false;
  }

  try {
    const zoned = convertUnixToZoned(numValue, timeZone, epochUnit);
    const startZoned = convertUnixToZoned(numStart, timeZone, epochUnit);
    const endZoned = convertUnixToZoned(numEnd, timeZone, epochUnit);

    if (!zoned || !startZoned || !endZoned) return false;

    const zdt = Temporal.ZonedDateTime.from(zoned);
    const startZdt = Temporal.ZonedDateTime.from(startZoned);
    const endZdt = Temporal.ZonedDateTime.from(endZoned);

    const startInstant = startZdt.toInstant();
    const endInstant = endZdt.toInstant();
    const valueInstant = zdt.toInstant();

    if (Temporal.Instant.compare(startInstant, endInstant) === 1) {
      return false;
    }

    const startCheck = inclusiveStart
      ? Temporal.Instant.compare(startInstant, valueInstant) <= 0
      : Temporal.Instant.compare(startInstant, valueInstant) < 0;
    const endCheck = inclusiveEnd
      ? Temporal.Instant.compare(valueInstant, endInstant) <= 0
      : Temporal.Instant.compare(valueInstant, endInstant) < 0;

    return startCheck && endCheck;
  } catch {
    return false;
  }
}
