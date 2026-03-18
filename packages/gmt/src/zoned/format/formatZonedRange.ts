import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

export function formatZonedRange(
  value1: string,
  value2: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isValidZonedDateTime(value1) || !isValidZonedDateTime(value2)) {
    return "";
  }

  let zdt1: Temporal.ZonedDateTime;
  let zdt2: Temporal.ZonedDateTime;
  try {
    zdt1 = Temporal.ZonedDateTime.from(value1);
    zdt2 = Temporal.ZonedDateTime.from(value2);
  } catch {
    return "";
  }

  const epochMs1 = Number(zdt1.toInstant().epochMilliseconds);
  const epochMs2 = Number(zdt2.toInstant().epochMilliseconds);
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: zdt1.timeZoneId,
    ...options,
  };

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).formatRange(
      epochMs1,
      epochMs2,
    );
  } catch {
    return "";
  }
}
