import { Temporal } from "@js-temporal/polyfill";
import { getLocalizedTimeZoneName } from "../../internal/formatHelpers";
import { normalizeDateTime } from "../../internal/normalizeDateTime";
import { normalizeTimeZone } from "../../internal/normalizeTimeZone";
import { isValidUtc } from "../validate";

type TimeZone = string | "local";

interface Options extends Intl.DateTimeFormatOptions {
  timeZone?: TimeZone;
  // opt-in: include localized timeZone name (e.g. "Coordinated Universal Time")
  includeTimeZoneName?: boolean;
}

// if valid timezone is passed, use it to convert to that timezone
// if no timezone, then keep as UTC
// if timezone passed as `local` then use system time

/**
 * Return a localized string for a UTC ISO input using Intl options.
 *
 * @param value UTC ISO string
 * @param locale optional BCP 47 locale identifier
 * @param options optional Intl.DateTimeFormatOptions with additional timeZone and includeTimeZoneName
 * @returns localized date-time string or "" on invalid input
 *
 * @example formatUtc("2024-03-15T14:30:00Z", "en-US", { dateStyle: "medium", timeStyle: "short" }) // "Mar 15, 2024 at 2:30 PM"
 * @example formatUtc("2024-03-15T14:30:00Z", "de-DE", { dateStyle: "medium", timeStyle: "short" }) // "15.03.2024, 14:30"
 * @example formatUtc("invalid") // ""
 *
 * Examples with passed timezones
 * @example formatUtc("2024-03-15T14:30:00Z", "en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" }) // "Mar 15, 2024 at 3:30 PM"
 * @example formatUtc("2024-03-15T14:30:00Z", "en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "local" }) // "Mar 15, 2024 at [time in system timezone]"
 */

export function formatUtc(
  value: string,
  locale?: string,
  options?: Options,
): string {
  if (!isValidUtc(value)) return "";

  try {
    const instant = Temporal.Instant.from(value);
    const {
      timeZone: tzOption,
      includeTimeZoneName,
      ...intlOptions
    } = (options || {}) as Options;

    const timeZone = normalizeTimeZone(tzOption as string | undefined);
    const zoned = instant.toZonedDateTimeISO(timeZone);
    const fmtOpts: Intl.DateTimeFormatOptions = {
      ...(intlOptions as Intl.DateTimeFormatOptions),
    };

    const base = zoned.toPlainDateTime().toLocaleString(locale, fmtOpts);
    if (includeTimeZoneName) {
      const tzNameOption =
        (intlOptions as Intl.DateTimeFormatOptions).timeZoneName ?? "long";
      const tzName = getLocalizedTimeZoneName(
        locale,
        timeZone,
        tzNameOption,
        instant.epochMilliseconds,
      );
      const out = tzName ? `${base} ${tzName}` : base;
      return normalizeDateTime(out);
    }

    return normalizeDateTime(base);
  } catch {
    return "";
  }
}
