import { Temporal } from "@js-temporal/polyfill";

export function formatZonedRange(
  value1: string,
  value2: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const zdt1 = Temporal.ZonedDateTime.from(value1);
  const zdt2 = Temporal.ZonedDateTime.from(value2);
  const epochMs1 = Number(zdt1.toInstant().epochMilliseconds);
  const epochMs2 = Number(zdt2.toInstant().epochMilliseconds);
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: zdt1.timeZoneId,
    ...options,
  };
  return new Intl.DateTimeFormat(locale, formatOptions).formatRange(
    epochMs1,
    epochMs2,
  );
}
