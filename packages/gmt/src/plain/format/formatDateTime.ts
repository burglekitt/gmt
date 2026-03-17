import { Temporal } from "@js-temporal/polyfill";

export function formatDateTime(
  value: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return Temporal.PlainDateTime.from(value).toLocaleString(locale, options);
}
