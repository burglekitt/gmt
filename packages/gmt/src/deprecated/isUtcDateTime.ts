import { isLeapSecond } from "../plain/validate/isLeapSecond";
import { utcDateTime } from "../regex/utc-date-time";

/**
 * @deprecated will be removed in v2.0.0 - use isValidUtc instead
 * Return true when the provided string is a valid ISO 8601 UTC datetime.
 *
 * - Rejects leap-seconds explicitly.
 * - Uses a regex to validate the UTC datetime format.
 *
 * @param value input UTC datetime string (ISO 8601)
 * @returns boolean indicating whether the input is a valid UTC datetime
 */
export function isUtcDateTime(value: string): boolean {
  if (isLeapSecond(value)) {
    return false;
  }
  return utcDateTime.test(value);
}
