import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain/get";
import { isValidTimezone } from "../../zoned/validate";

/**
 * Return true when the Unix timestamp is between start and end (inclusive by default).
 *
 * - Accepts Unix timestamps in milliseconds (default) or seconds.
 * - Returns false for invalid inputs.
 *
 * @param value Unix timestamp to check
 * @param start Unix timestamp for range start
 * @param end Unix timestamp for range end
 * @param options epochUnit optional "seconds" | "milliseconds", timeZone optional IANA timezone, inclusiveStart optional, inclusiveEnd optional
 * @example isBetweenUnix(1705000000000, 1704000000000, 1706000000000) // true
 * @example isBetweenUnix(1705000000, 1704000000, 1706000000, { epochUnit: "seconds" }) // true
 * @example isBetweenUnix(1703000000000, 1704000000000, 1706000000000) // false
 * @returns boolean indicating whether value is between start and end
 */
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
