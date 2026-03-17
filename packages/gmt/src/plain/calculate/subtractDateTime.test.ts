import { subtractDateTime } from "./subtractDateTime";

describe("subtractDateTime", () => {
  it.each`
    value                 | amount | unit        | expected
    ${"2024-03-17T14:30"} | ${1}   | ${"day"}    | ${"2024-03-16T14:30:00"}
    ${"2024-03-17T14:30"} | ${2}   | ${"hour"}   | ${"2024-03-17T12:30:00"}
    ${"2024-03-17T14:30"} | ${45}  | ${"minute"} | ${"2024-03-17T13:45:00"}
    ${"2024-03-17T14:30"} | ${1}   | ${"month"}  | ${"2024-02-17T14:30:00"}
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
      expect(subtractDateTime(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid datetime", () => {
    expect(() => subtractDateTime("invalid", 1, "hour")).toThrow();
  });
});
// arg 1 is ISO datetime, arg 2 is number, arg 3 is unit
