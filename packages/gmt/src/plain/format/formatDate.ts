import { Temporal } from "@js-temporal/polyfill";

export function formatDate(
  value: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return Temporal.PlainDate.from(value).toLocaleString(locale, options);
}
