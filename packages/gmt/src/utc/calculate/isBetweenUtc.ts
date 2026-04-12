import { Temporal } from "@js-temporal/polyfill";
import { isValidUtc } from "../validate";

export function isBetweenUtc(
  value: string,
  start: string,
  end: string,
  options?: {
    inclusiveStart?: boolean;
    inclusiveEnd?: boolean;
  },
): boolean {
  const inclusiveStart = options?.inclusiveStart ?? true;
  const inclusiveEnd = options?.inclusiveEnd ?? true;

  if (!isValidUtc(value) || !isValidUtc(start) || !isValidUtc(end)) {
    return false;
  }

  let instant: Temporal.Instant;
  let startInstant: Temporal.Instant;
  let endInstant: Temporal.Instant;

  try {
    instant = Temporal.Instant.from(value);
    startInstant = Temporal.Instant.from(start);
    endInstant = Temporal.Instant.from(end);
  } catch {
    return false;
  }

  try {
    if (Temporal.Instant.compare(startInstant, endInstant) === 1) {
      return false;
    }

    const startCheck = inclusiveStart
      ? Temporal.Instant.compare(startInstant, instant) <= 0
      : Temporal.Instant.compare(startInstant, instant) < 0;
    const endCheck = inclusiveEnd
      ? Temporal.Instant.compare(instant, endInstant) <= 0
      : Temporal.Instant.compare(instant, endInstant) < 0;

    return startCheck && endCheck;
  } catch {
    return false;
  }
}
