import { zuluDateTime } from "../../regex/date-time";

/**
 * Validates whether a string is a valid ISO 8601 Zulu (UTC) datetime.
 * @param value The string to validate
 * @returns `true` if the string is a valid Zulu datetime (e.g. "2024-03-17T14:30:45Z"), `false` otherwise
 */
export function isZuluDateTime(value: string): boolean {
  return zuluDateTime.test(value);
}
