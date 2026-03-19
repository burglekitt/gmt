import { utcDateTime } from "../../regex/date-time";

/**
 * Validates whether a string is a valid ISO 8601 UTC datetime.
 * @param value The string to validate
 * @returns `true` if the string is a valid UTC datetime (e.g. "2024-03-17T14:30:45Z"), `false` otherwise
 */
export function isUtcDateTime(value: string): boolean {
  return utcDateTime.test(value);
}
