import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import type { UnixUnit } from "../validate/isValidUnixUnit";

/**
 * Return whether `value1` represents an instant strictly before `value2`.
 *
 * - Both inputs must be valid unix epoch numbers (or strings).
 * - Comparison is performed using Temporal.Instant (same instant semantics).
 * - Invalid inputs return `false`.
 *
 * @param value1 first unix epoch value
 * @param value2 second unix epoch value
 * @param options epoch unit and options
 * @example isBeforeUnix(1704067200, 1706659200) // true
 * @example isBeforeUnix(1706659200, 1706659200) // false
 * @returns `true` if `value1` is before `value2`, otherwise `false`
 */
export function isBeforeUnix(
  value1: string | number,
  value2: string | number,
  options?: {
    epochUnit?: UnixUnit;
  },
): boolean {
  const epochUnit = options?.epochUnit ?? "milliseconds";

  const numValue1 = typeof value1 === "string" ? Number(value1) : value1;
  const numValue2 = typeof value2 === "string" ? Number(value2) : value2;

  if (!isValidAmount(numValue1) || !isValidAmount(numValue2)) {
    return false;
  }

  try {
    const instant1 = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numValue1 * 1000 : numValue1,
    );
    const instant2 = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numValue2 * 1000 : numValue2,
    );

    return Temporal.Instant.compare(instant1, instant2) === -1;
  } catch {
    return false;
  }
}
