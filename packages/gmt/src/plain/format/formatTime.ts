import { Temporal } from "@js-temporal/polyfill";

export function formatTime(
  value: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return Temporal.PlainTime.from(value).toLocaleString(locale, options);
}
