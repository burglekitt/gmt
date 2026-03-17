import { subtractDate } from "./subtractDate";

describe("subtractDate", () => {
  it.each`
    value           | amount | unit       | expected
    ${"2024-03-17"} | ${1}   | ${"day"}   | ${"2024-03-16"}
    ${"2024-03-17"} | ${2}   | ${"week"}  | ${"2024-03-03"}
    ${"2024-03-31"} | ${1}   | ${"month"} | ${"2024-02-29"}
    ${"2024-03-17"} | ${1}   | ${"year"}  | ${"2023-03-17"}
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
      unit: "year" | "month" | "week" | "day";
      expected: string;
    }) => {
      expect(subtractDate(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid date", () => {
    expect(() => subtractDate("invalid", 1, "day")).toThrow();
  });
});
