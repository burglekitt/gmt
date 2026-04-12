import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { isValidTimezone } from "../../zoned/validate";

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

  if (!timeZone || !isValidTimezone(timeZone)) return false;

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
    const instant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numValue * 1000 : numValue,
    );
    const startInstant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numStart * 1000 : numStart,
    );
    const endInstant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numEnd * 1000 : numEnd,
    );

    if (Temporal.Instant.compare(startInstant, endInstant) === 1) {
      return false;
    }

    const startCheck = inclusiveStart
      ? Temporal.Instant.compare(startInstant, instant) <= 0
      : Temporal.Instant.compare(startInstant, instant) < 0;
    const endCheck = inclusiveEnd
      ? Temporal.Instant.compare(instant, endInstant) <= 0
      : Temporal.Instant.compare(instant, endInstant) < 0;

    return startCheck && endCheck;
  } catch {
    return false;
  }
}
