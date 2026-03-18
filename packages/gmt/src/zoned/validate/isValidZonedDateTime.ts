import { Temporal } from "@js-temporal/polyfill";

export function isValidZonedDateTime(value: string): boolean {
  if (/T\d{2}:\d{2}:60(?:[.,]\d+)?(?:[+-Zz[])/.test(value)) {
    return false;
  }

  try {
    const zonedDateTime = Temporal.ZonedDateTime.from(value);
    return zonedDateTime.timeZoneId.length > 0;
  } catch {
    return false;
  }
}
