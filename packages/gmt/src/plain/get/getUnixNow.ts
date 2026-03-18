import { Temporal } from "@js-temporal/polyfill";

// Returns the current unix timestamp in seconds or milliseconds.
export function getUnixNow(unit: "seconds" | "milliseconds"): number {
  const instant = Temporal.Now.instant();
  if (unit === "seconds") {
    return Math.floor(instant.epochMilliseconds / 1000);
  }
  return instant.epochMilliseconds;
}
