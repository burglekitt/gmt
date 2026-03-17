import { Temporal } from "@js-temporal/polyfill";

type TimeUnit = "hour" | "minute" | "second" | "millisecond";

export function addTime(value: string, amount: number, unit: TimeUnit): string {
  const time = Temporal.PlainTime.from(value);

  switch (unit) {
    case "hour":
      return time.add({ hours: amount }).toString();
    case "minute":
      return time.add({ minutes: amount }).toString();
    case "second":
      return time.add({ seconds: amount }).toString();
    case "millisecond":
      return time.add({ milliseconds: amount }).toString();
  }
}
