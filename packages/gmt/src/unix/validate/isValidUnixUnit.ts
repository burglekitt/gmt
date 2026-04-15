export type UnixUnit = "seconds" | "milliseconds";

/**
 * Return true when `unit` is a valid UnixUnit.
 *
 * - Valid units are: "seconds", "milliseconds".
 * - Uses type assertion to narrow the type.
 *
 * @param unit string candidate
 * @returns boolean indicating whether the unit is a valid UnixUnit
 *
 * @example isValidUnixUnit("seconds") // true
 * @example isValidUnixUnit("milliseconds") // true
 * @example isValidUnixUnit("invalid") // false
 */
export function isValidUnixUnit(unit: string): unit is UnixUnit {
  return unit === "seconds" || unit === "milliseconds";
}
