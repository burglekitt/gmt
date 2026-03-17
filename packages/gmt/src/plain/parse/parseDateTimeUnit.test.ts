import { parseDateTimeUnit } from "./parseDateTimeUnit";

describe("parseDateTimeUnit", () => {
  const value = "2024-03-17T14:30:45.123";

  it.each`
    unit             | expected
    ${"year"}        | ${"2024"}
    ${"month"}       | ${"03"}
    ${"day"}         | ${"17"}
    ${"hour"}        | ${"14"}
    ${"minute"}      | ${"30"}
    ${"second"}      | ${"45"}
    ${"millisecond"} | ${"123"}
  `("returns $expected for unit $unit", ({ unit, expected }) => {
    expect(
      parseDateTimeUnit(
        value,
        unit as
          | "year"
          | "month"
          | "day"
          | "hour"
          | "minute"
          | "second"
          | "millisecond",
      ),
    ).toBe(expected);
  });

  it("throws for an invalid datetime string", () => {
    expect(() => parseDateTimeUnit("not-a-datetime", "year")).toThrow();
  });
});
