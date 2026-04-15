import { Temporal } from "@js-temporal/polyfill";
import { isValidTime } from "../validate";

/**
 * Return the earliest (minimum) of the given PlainTime values.
 *
 * @param times Array of ISO PlainTime strings (e.g. "14:30:00")
 * @returns The earliest time string, or null on invalid input
 * 
 * @example minTime(["14:30:00", "09:00:00", "20:45:00"]) // "09:00:00"
 * @example minTime(["invalid", "09:00:00", "20:45:00"]) // "09:00:00"
 * @example minTime(["invalid", "also invalid"]) // null
 * @example minTime([]) // null
 */
export function minTime(times: string[]): string | null {
  if (!times.length) return null;

  const valid = times.filter(isValidTime);
  if (!valid.length) return null;

  try {
    const comparables = valid.map((t) => Temporal.PlainTime.from(t));
    comparables.sort(Temporal.PlainTime.compare);

    return comparables[0].toString();
  } catch {
    return null;
  }
}
