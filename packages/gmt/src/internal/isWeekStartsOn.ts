/**
 * Type guard to check if a value is a valid `weekStartsOn` option ("monday" or "sunday").
 *
 * @param value unknown value to check
 * @example isWeekStartsOn("monday") // true
 * @example isWeekStartsOn("sunday") // true
 * @example isWeekStartsOn("tuesday") // false
 * @returns boolean indicating whether the value is a valid `weekStartsOn` option
 */
export function isWeekStartsOn(value: unknown): value is "monday" | "sunday" {
  return value === "monday" || value === "sunday";
}
