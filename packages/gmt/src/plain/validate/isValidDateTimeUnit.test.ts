import { isValidDateTimeUnit } from "./isValidDateTimeUnit";

describe("isValidDateTimeUnit", () => {
  it.each`
    unit
    ${"years"}
    ${"months"}
    ${"weeks"}
    ${"days"}
    ${"hours"}
    ${"minutes"}
    ${"seconds"}
    ${"milliseconds"}
    ${"microseconds"}
    ${"nanoseconds"}
  `("returns true for valid date time  unit: $unit", ({ unit }) => {
    expect(isValidDateTimeUnit(unit)).toBe(true);
  });

  it.each`
    invalidUnit
    ${"not-a-unit"}
    ${""}
    ${1}
    ${0}
    ${true}
    ${false}
    ${null}
    ${undefined}
  `("returns false for invalid date unit: $invalidUnit", ({ invalidUnit }) => {
    expect(isValidDateTimeUnit(invalidUnit)).toBe(false);
  });
});
