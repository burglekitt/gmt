import { Temporal } from "@js-temporal/polyfill";
import { isValidDateTime } from "../../plain/validate";
import { isValidTimeZone } from "../validate";

/**
 * Attach the specified `timeZone` to a plain datetime string and return a
 * zoned ISO 8601 datetime string.
 *
 * - `value` must be a plain datetime (no timeZone suffix).
 * - Returns empty string "" for invalid inputs.
 * - `optionsArg.smallestUnit` controls precision of the returned string.
 *
 * @param value plain datetime string (e.g. "2024-02-29T14:30:45")
 * @param timeZone IANA timeZone identifier
 * @param optionsArg Optional formatting options. Supports `smallestUnit` to control precision.
 * @returns zoned ISO 8601 datetime string or empty string when invalid
 */
export function getZonedDateTime(
  value: string,
  timeZone: string,
  optionsArg?: {
    smallestUnit?: Temporal.ZonedDateTimeToStringOptions["smallestUnit"];
  },
): string {
  if (!isValidDateTime(value) || !isValidTimeZone(timeZone)) {
    return "";
  }

  const options = {
    smallestUnit: "milliseconds",
    ...optionsArg,
  } as Partial<Temporal.ZonedDateTimeToStringOptions>;

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(`${value}[${timeZone}]`);
    return zonedDateTime.toString(options);
  } catch {
    return "";
  }
}
