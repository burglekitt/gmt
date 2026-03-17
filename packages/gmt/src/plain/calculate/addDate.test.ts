import { addDate } from "./addDate";

describe("addDate", () => {
  it.each`
    value           | amount | unit       | expected
    ${"2024-03-17"} | ${1}   | ${"day"}   | ${"2024-03-18"}
    ${"2024-03-17"} | ${2}   | ${"week"}  | ${"2024-03-31"}
    ${"2024-01-31"} | ${1}   | ${"month"} | ${"2024-02-29"}
    ${"2024-03-17"} | ${1}   | ${"year"}  | ${"2025-03-17"}
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
      unit: "year" | "month" | "week" | "day";
      expected: string;
    }) => {
      expect(addDate(value, amount, unit)).toBe(expected);
    },
  );

  it("throws for an invalid date", () => {
    expect(() => addDate("invalid", 1, "day")).toThrow();
  });
});
