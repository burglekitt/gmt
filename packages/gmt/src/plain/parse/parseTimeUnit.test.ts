import { parseTimeUnit } from "./parseTimeUnit";

describe("parseTimeUnit", () => {
  const value = "14:30:45.123";

  it.each`
    unit             | expected
    ${"hour"}        | ${"14"}
    ${"minute"}      | ${"30"}
    ${"second"}      | ${"45"}
    ${"millisecond"} | ${"123"}
  `("returns $expected for unit $unit", ({ unit, expected }) => {
    expect(
      parseTimeUnit(
        value,
        unit as "hour" | "minute" | "second" | "millisecond",
      ),
    ).toBe(expected);
  });

  it("throws for an invalid time string", () => {
    expect(() => parseTimeUnit("not-a-time", "hour")).toThrow();
  });
});
