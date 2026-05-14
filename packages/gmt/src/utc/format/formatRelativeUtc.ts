import { Temporal } from "@js-temporal/polyfill";
import {
  type FormatRelativeOptions,
  formatRelativeTemporal,
  mapLargestUnit,
  resolveReferenceToZoned,
} from "../../internal/formatHelpers";
import { normalizeTimeZone } from "../../internal/normalizeTimeZone";
import { isValidUtc } from "../validate";

interface Options extends FormatRelativeOptions {
  timeZone?: string | "local";
  reference?: string | number;
}

/**
 * Return a localized relative time string for a UTC ISO input using Intl options.
 *
 * - Accepts `options.largestUnit` in either Intl singular form (e.g. "day") or
 *   as a `DateTimeDurationUnit` (plural) such as "days". Plural units are mapped
 *   to the corresponding singular Intl unit; sub-second units (milliseconds,
 *   microseconds, nanoseconds) fall back to "second" for formatting.
 * - `timeZone: "local"` is resolved via the internal `getSystemTimeZone()` helper; invalid time zones fall back to "UTC".
 * - `options.reference` may be a UTC ISO string or a numeric epoch (milliseconds).
 * - Returns `""` on invalid input or invalid `largestUnit`.
 *
 * @param value UTC ISO string
 * @param locale optional BCP 47 locale identifier
 * @param options optional FormatRelativeOptions with additional `timeZone`, `reference`, and `largestUnit` properties
 * @returns localized relative time string or "" on invalid input
 *
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { reference: "2024-05-01T13:00:00Z" }) // "hour"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { reference: "2024-05-01T13:00:00Z", numeric: "always" }) // "1 hour ago"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { reference: 1714598400000 }) // "day"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { reference: 1714598400000, numeric: "always" }) // "1 day ago"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "Europe/Paris", reference: "2024-05-01T13:00:00Z" }) // "hour"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "local", reference: "2024-05-01T13:00:00Z" }) // "hour"
 * @example formatRelativeUtc("invalid") // ""
 *
 * Examples with passed timezones and plural `largestUnit`
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "Europe/Paris", reference: "2024-05-01T13:00:00Z" }) // "hour"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "local", reference: "2024-05-01T13:00:00Z" }) // "hour"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "Europe/Paris", reference: 1714598400000 }) // "day"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "local", reference: 1714598400000 }) // "day"
 * @example formatRelativeUtc("2024-05-01T12:00:00Z", "en-US", { timeZone: "Europe/Paris", reference: 1714598400000, largestUnit: "days" }) // "day"
 */
export function formatRelativeUtc(
  value: string,
  locale?: string,
  options?: Options,
): string {
  if (!isValidUtc(value)) return "";

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

    const instant = Temporal.Instant.from(value);
    const zoned = instant.toZonedDateTimeISO(tz);

    const ref = resolveReferenceToZoned(reference, "milliseconds", tz);

    return formatRelativeTemporal(zoned, ref, locale, finalOpts);
  } catch {
    return "";
  }
}
