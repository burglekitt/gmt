import { Temporal } from "@js-temporal/polyfill";
import { isValidTimeZone } from "../validate";

/**
 * Return the current zoned datetime for the specified IANA timeZone.
 *
 * - Uses `Temporal.Now.zonedDateTimeISO(ianaTimezone)`.
 * - Returns empty string "" for invalid timeZone or on failure.
 *
 * @param ianaTimezone IANA timeZone identifier
 * @param options Optional formatting options for the returned string. Currently supports:
 * @returns zoned ISO 8601 datetime string or empty string when invalid
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
