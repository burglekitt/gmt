import { addZoned } from "./addZoned";

describe("addZoned", () => {
  it.each`
    value                               | amount | unit        | expected
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${2}   | ${"hour"}   | ${"2024-03-17T16:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${45}  | ${"minute"} | ${"2024-03-17T15:15:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"day"}    | ${"2024-03-18T14:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"month"}  | ${"2024-04-17T14:30:00+00:00[UTC]"}
  `(
    "returns $expected for $value + $amount $unit",
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
      expect(addZoned(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid zoned datetime", () => {
    expect(() => addZoned("invalid", 1, "hour")).toThrow();
  });
});
