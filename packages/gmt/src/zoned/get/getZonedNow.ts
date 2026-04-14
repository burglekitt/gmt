import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current zoned datetime for the specified IANA timeZone.
 *
 * - Uses `Temporal.Now.zonedDateTimeISO(ianaTimezone)`.
 * - Returns empty string "" for invalid timeZone or on failure.
 * - Defaults to millisecond precision when not specified.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @param optionsArg Optional formatting options. Supports `smallestUnit` to control precision.
 * @returns zoned ISO 8601 datetime string or "" when invalid
 * @example getZonedNow("America/New_York") // "2024-02-29T09:30:45.123-05:00[America/New_York]"
 * @example getZonedNow("America/New_York", { smallestUnit: "second" }) // "2024-02-29T09:30:45-05:00[America/New_York]"
 * @example getZonedNow("Invalid/Zone") // ""
 */
export function getZonedNow(
  ianaTimezone: string,
  optionsArg?: {
    smallestUnit?: Temporal.ZonedDateTimeToStringOptions["smallestUnit"];
    // todo add comprehensive options support here and ALL methods
  },
): string {
  const options = {
    smallestUnit: "milliseconds",
    ...optionsArg,
  } as Partial<Temporal.ZonedDateTimeToStringOptions>;
  if (!isValidTimeZone(ianaTimezone)) {
    return "";
  }

  try {
    const now = Temporal.Now.zonedDateTimeISO(ianaTimezone);
    return now.toString(options);
  } catch {
    return "";
  }
}
