import { subtractZoned } from "./subtractZoned";

describe("subtractZoned", () => {
  it.each`
    value                               | amount | unit        | expected
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${2}   | ${"hour"}   | ${"2024-03-17T12:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${45}  | ${"minute"} | ${"2024-03-17T13:45:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"day"}    | ${"2024-03-16T14:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"month"}  | ${"2024-02-17T14:30:00+00:00[UTC]"}
  `(
    "returns $expected for $value - $amount $unit",
    ({
      value,
      amount,
      unit,
      expected,
    }: {
      value: string;
      amount: number;
      unit:
        | "year"
        | "month"
        | "week"
        | "day"
        | "hour"
        | "minute"
        | "second"
        | "millisecond";
      expected: string;
    }) => {
      expect(subtractZoned(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid zoned datetime", () => {
    expect(() => subtractZoned("invalid", 1, "hour")).toThrow();
  });
});
