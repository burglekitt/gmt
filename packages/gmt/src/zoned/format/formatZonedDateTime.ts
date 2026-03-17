import { Temporal } from "@js-temporal/polyfill";

export function formatZonedDateTime(
  value: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return Temporal.ZonedDateTime.from(value).toLocaleString(locale, options);
}
