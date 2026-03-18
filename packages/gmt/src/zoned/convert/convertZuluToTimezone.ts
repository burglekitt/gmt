import { Temporal } from "@js-temporal/polyfill";
import { isZuluDateTime } from "../../plain/validate/isZuluDateTime";
import { isValidTimezone } from "../validate";

export function convertZuluToTimezone(value: string, timeZone: string): string {
  if (!isZuluDateTime(value) || !isValidTimezone(timeZone)) {
    return "";
  }

  try {
    return Temporal.Instant.from(value).toZonedDateTimeISO(timeZone).toString();
  } catch {
    return "";
  }
}
