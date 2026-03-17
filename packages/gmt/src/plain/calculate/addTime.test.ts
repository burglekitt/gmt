import { addTime } from "./addTime";

describe("addTime", () => {
  it.each`
    value         | amount | unit             | expected
    ${"14:30:00"} | ${2}   | ${"hour"}        | ${"16:30:00"}
    ${"14:30:00"} | ${45}  | ${"minute"}      | ${"15:15:00"}
    ${"23:59:30"} | ${45}  | ${"second"}      | ${"00:00:15"}
    ${"14:30:00"} | ${250} | ${"millisecond"} | ${"14:30:00.25"}
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
      unit: "hour" | "minute" | "second" | "millisecond";
      expected: string;
    }) => {
      expect(addTime(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid time", () => {
    expect(() => addTime("invalid", 1, "minute")).toThrow();
  });
});
