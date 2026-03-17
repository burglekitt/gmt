import { parseZonedUnit } from "./parseZonedUnit";

describe("parseZonedUnit", () => {
  const value = "2024-03-17T14:30:45.123-04:00[America/New_York]";

  it.each`
    unit             | expected
    ${"year"}        | ${"2024"}
    ${"month"}       | ${"03"}
    ${"day"}         | ${"17"}
    ${"hour"}        | ${"14"}
    ${"minute"}      | ${"30"}
    ${"second"}      | ${"45"}
    ${"millisecond"} | ${"123"}
    ${"timezone"}    | ${"America/New_York"}
  `("returns $expected for $unit", ({ unit, expected }) => {
    expect(
      parseZonedUnit(
        value,
        unit as
          | "year"
          | "month"
          | "day"
          | "hour"
          | "minute"
          | "second"
          | "millisecond"
          | "timezone",
      ),
    ).toBe(expected);
  });
});
