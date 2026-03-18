import { Temporal } from "@js-temporal/polyfill";

// function returns get unix timestamp in seconds or milliseconds from a zoned datetime string
export function getUnixNow(unit: "seconds" | "milliseconds"): number {
  const instant = Temporal.Now.instant();
  if (unit === "seconds") {
    return Math.floor(instant.epochMilliseconds / 1000);
  }
  return instant.epochMilliseconds;
}
