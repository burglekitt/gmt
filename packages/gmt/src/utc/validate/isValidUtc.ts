import { Temporal } from "@js-temporal/polyfill";
import { isLeapSecond } from "../../plain/validate";
import { utcDateTime } from "../../regex/utc-date-time";

/**
 * Return true when the provided string is a valid ISO 8601 UTC datetime.
 *
 * - Rejects leap-seconds explicitly.
 * - Uses a regex to validate the UTC datetime format.
 *
 * @param value input UTC datetime string (ISO 8601)
 * @returns boolean indicating whether the input is a valid UTC datetime
 */
export function isValidUtc(value: string): boolean {
  // TODO is this leap second a problem here and everywhere
  if (isLeapSecond(value)) {
    return false;
  }

  // need to NOT just do regex test but ALSO proper validation test
  if (!utcDateTime.test(value)) {
    return false;
  }

  try {
    Temporal.Instant.from(value);
    return true;
  } catch {
    return false;
  }
}
