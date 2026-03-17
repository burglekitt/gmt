import { subtractTime } from "./subtractTime";

describe("subtractTime", () => {
  it.each`
    value         | amount | unit             | expected
    ${"14:30:00"} | ${2}   | ${"hour"}        | ${"12:30:00"}
    ${"14:30:00"} | ${45}  | ${"minute"}      | ${"13:45:00"}
    ${"00:00:30"} | ${45}  | ${"second"}      | ${"23:59:45"}
    ${"14:30:00"} | ${250} | ${"millisecond"} | ${"14:29:59.75"}
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
      unit: "hour" | "minute" | "second" | "millisecond";
      expected: string;
    }) => {
      expect(subtractTime(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid time", () => {
    expect(() => subtractTime("invalid", 1, "minute")).toThrow();
  });
});
