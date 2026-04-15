import { Temporal } from "@js-temporal/polyfill";

import { isValidTime } from "../validate";

/**
 * Return true when `time` is between `start` and `end` (inclusive by default).
 *
 * - Validates inputs and then compares using Temporal.PlainTime.compare.
 * - Returns false for invalid inputs.
 * - Note: PlainTime comparison does not account for day overflow - wrap in PlainDateTime for day-spanning ranges.
 *
 * @param time ISO PlainTime string to check
 * @param start ISO PlainTime string for the start of the range
 * @param end ISO PlainTime string for the end of the range
 * @param options { inclusiveStart?: boolean = true, inclusiveEnd?: boolean = true }
 * @returns boolean indicating whether time is between start and end
 *
 * @example isBetweenTime("12:34:56", "12:00:00", "13:00:00") // true
 * @example isBetweenTime("12:34:56", "12:34:56", "13:00:00") // true
 * @example isBetweenTime("12:34:56", "12:34:57", "13:00:00") // false
 * @example isBetweenTime("12:34:56", "12:00:00", "12:34:56") // true
 * @example isBetweenTime("12:34:56", "12:00:00", "12:34:55") // false
 * @example isBetweenTime("invalid", "12:00:00", "13:00:00") // false
 * @example isBetweenTime("12:34:56", "invalid", "13:00:00") // false
 * @example isBetweenTime("12:34:56", "12:00:00", "invalid") // false
 */
export function isBetweenTime(
  time: string,
  start: string,
  end: string,
  options?: {
    inclusiveStart?: boolean;
    inclusiveEnd?: boolean;
  },
): boolean {
  const inclusiveStart = options?.inclusiveStart ?? true;
  const inclusiveEnd = options?.inclusiveEnd ?? true;

  if (!isValidTime(time) || !isValidTime(start) || !isValidTime(end)) {
    return false;
  }

  try {
    const t = Temporal.PlainTime.from(time);
    const s = Temporal.PlainTime.from(start);
    const e = Temporal.PlainTime.from(end);

    if (Temporal.PlainTime.compare(s, e) === 1) {
      return false;
    }

    const startCheck = inclusiveStart
      ? Temporal.PlainTime.compare(s, t) <= 0
      : Temporal.PlainTime.compare(s, t) < 0;
    const endCheck = inclusiveEnd
      ? Temporal.PlainTime.compare(t, e) <= 0
      : Temporal.PlainTime.compare(t, e) < 0;

    return startCheck && endCheck;
  } catch {
    return false;
  }
}
