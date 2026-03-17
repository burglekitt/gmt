import { parseDateUnit } from "./parseDateUnit";

describe("parseDateUnit", () => {
  const value = "2024-03-17";

  it.each`
    unit       | expected
    ${"year"}  | ${"2024"}
    ${"month"} | ${"03"}
    ${"day"}   | ${"17"}
  `("returns $expected for unit $unit", ({ unit, expected }) => {
    expect(parseDateUnit(value, unit as "year" | "month" | "day")).toBe(
      expected,
    );
  });

  it("throws for an invalid date string", () => {
    expect(() => parseDateUnit("not-a-date", "year")).toThrow();
  });
});
