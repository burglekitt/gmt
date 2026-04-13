import { Temporal } from "@js-temporal/polyfill";
import { isValidAmount } from "../../internal";
import { isValidUnixUnit, type UnixUnit } from "../validate/isValidUnixUnit";

/**
 * Convert a unix epoch value to a UTC Instant ISO string.
 *
 * - `value` is numeric milliseconds (default) or seconds when `unit` is "seconds".
 * - Accepts both number and string inputs.
 * - Returns empty string "" for invalid inputs.
 *
 * @param value epoch value (number or string)
 * @param unit optional unit, "seconds" or "milliseconds"
 * @returns UTC Instant string or empty string when invalid
 */
export function convertUnixToUtc(
  value: number | string,
  ...unitInput: [unit?: UnixUnit]
): string {
  const resolvedUnit = unitInput.length === 0 ? "milliseconds" : unitInput[0];

  const numValue = typeof value === "string" ? Number(value) : value;

  if (!isValidAmount(numValue) || !isValidUnixUnit(resolvedUnit ?? "")) {
    return "";
  }

  try {
    const instant = Temporal.Instant.fromEpochMilliseconds(
      resolvedUnit === "seconds" ? numValue * 1000 : numValue,
    );

    return instant.toString();
  } catch {
    return "";
  }
}
