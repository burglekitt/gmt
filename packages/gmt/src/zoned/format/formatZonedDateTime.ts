import { Temporal } from "@js-temporal/polyfill";
import { isValidZonedDateTime } from "../validate";

export function formatZonedDateTime(
  value: string,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isValidZonedDateTime(value)) {
    return "";
  }

  let zonedDateTime: Temporal.ZonedDateTime;
  try {
    zonedDateTime = Temporal.ZonedDateTime.from(value);
  } catch {
    return "";
  }

  try {
    return zonedDateTime.toLocaleString(locale, options);
  } catch {
    return "";
  }
}
