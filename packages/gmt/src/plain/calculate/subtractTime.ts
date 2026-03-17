import { Temporal } from "@js-temporal/polyfill";

type TimeUnit = "hour" | "minute" | "second" | "millisecond";

export function subtractTime(
  value: string,
  amount: number,
  unit: TimeUnit,
): string {
  const time = Temporal.PlainTime.from(value);

  switch (unit) {
    case "hour":
      return time.subtract({ hours: amount }).toString();
    case "minute":
      return time.subtract({ minutes: amount }).toString();
    case "second":
      return time.subtract({ seconds: amount }).toString();
    case "millisecond":
      return time.subtract({ milliseconds: amount }).toString();
  }
}
