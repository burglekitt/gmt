import { Temporal } from "@js-temporal/polyfill";

import { isValidZonedDateTime } from "../validate";

export function isBeforeZoned(value1: string, value2: string): boolean {
  if (!isValidZonedDateTime(value1) || !isValidZonedDateTime(value2)) {
    return false;
  }

  try {
    return (
      Temporal.Instant.compare(
        Temporal.ZonedDateTime.from(value1).toInstant(),
        Temporal.ZonedDateTime.from(value2).toInstant(),
      ) === -1
    );
  } catch {
    return false;
  }
}
