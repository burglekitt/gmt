import { Temporal } from "@js-temporal/polyfill";
import {
  type FormatRelativeOptions,
  formatRelativeTemporal,
  mapLargestUnit,
  resolveReferenceToZoned,
} from "../../internal/formatHelpers";
import { normalizeTimeZone } from "../../internal/normalizeTimeZone";
import { isValidZonedDateTime } from "../validate";

interface Options extends FormatRelativeOptions {
  /** Optional IANA time zone (e.g. "America/New_York", "local", "UTC") */
  timeZone?: string;
  /** Optional ISO ZonedDateTime or numeric epoch milliseconds reference */
  reference?: string | number;
}

/**
 * Return a localized relative time string for a ZonedDateTime ISO input.
 *
 * - Accepts `options.largestUnit` in either Intl singular form (e.g. "day") or
 *   as a `DateTimeDurationUnit` (plural) such as "days". Plural units are mapped
 *   to the corresponding singular Intl unit; sub-second units (milliseconds,
 *   microseconds, nanoseconds) fall back to "second" for formatting.
 * - `timeZone` is applied to the input value via `toZonedDateTimeISO(tz)`;
 *   invalid time zones fall back to "UTC".
 * - `options.reference` may be a ZonedDateTime ISO string or a numeric epoch
 *   (milliseconds).
 * - Returns `""` on invalid input or invalid `largestUnit`.
 *
 * @param value ZonedDateTime ISO string
 * @param locale optional BCP 47 locale identifier
 * @param options optional FormatRelativeOptions with additional `timeZone`, `reference`, and `largestUnit` properties
 * @returns localized relative time string or "" on invalid input
 *
 * @example formatRelativeZoned("2024-05-01T12:00:00+00:00[UTC]", "en-US", { reference: "2024-05-01T13:00:00+00:00[UTC]" }) // "hour"
 * @example formatRelativeZoned("2024-05-01T12:00:00+00:00[UTC]", "en-US", { reference: "2024-05-01T13:00:00+00:00[UTC]", numeric: "always" }) // "1 hour ago"
 * @example formatRelativeZoned("2024-05-01T12:00:00+00:00[UTC]", "en-US", { reference: 1714598400000 }) // "day"
 * @example formatRelativeZoned("2024-05-01T12:00:00+00:00[UTC]", "en-US", { reference: 1714598400000, numeric: "always" }) // "1 day ago"
 * @example formatRelativeZoned("2024-05-01T12:00:00+00:00[UTC]", "en-US", { timeZone: "America/New_York", reference: "2024-05-01T13:00:00+00:00[UTC]" }) // "hour"
 * @example formatRelativeZoned("invalid") // ""
 */
export function formatRelativeZoned(
  value: string,
  locale?: string,
  options?: Options,
): string {
  if (!isValidZonedDateTime(value)) return "";

  try {
    const { timeZone, reference, ...opts } = options ?? {};

    const mappedLargest = mapLargestUnit(
      (opts as Record<string, unknown>).largestUnit as unknown as
        | string
        | undefined,
    );
    if (mappedLargest === null) return "";

    const finalOpts: FormatRelativeOptions = {
      ...(opts as FormatRelativeOptions),
      ...(mappedLargest ? { largestUnit: mappedLargest } : {}),
    };

    const tz = normalizeTimeZone(timeZone as string | undefined);

    const parsed = Temporal.ZonedDateTime.from(value);
    const zoned = parsed.toInstant().toZonedDateTimeISO(tz);

    const ref = resolveReferenceToZoned(reference, "milliseconds", tz);

    return formatRelativeTemporal(zoned, ref, locale, finalOpts);
  } catch (e) {
    // Log the error details for debugging tests (temporary).
    // eslint-disable-next-line no-console
    console.error("formatRelativeZoned error:", e, {
      value,
      type: typeof value,
    });
    return "";
  }
}
