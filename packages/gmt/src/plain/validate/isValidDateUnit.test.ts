import { isValidDateUnit } from "./isValidDateUnit";

describe("isValidDateUnit", () => {
  it.each`
    unit
    ${"years"}
    ${"months"}
    ${"weeks"}
    ${"days"}
  `("returns true for valid date unit: $unit", ({ unit }) => {
    expect(isValidDateUnit(unit)).toBe(true);
  });

  it.each`
    invalidUnit
    ${"hours"}
    ${"minutes"}
    ${"seconds"}
    ${"milliseconds"}
    ${"microseconds"}
    ${"nanoseconds"}
    ${"not-a-unit"}
    ${""}
    ${1}
    ${0}
    ${true}
    ${false}
    ${null}
    ${undefined}
  `("returns false for invalid date unit: $invalidUnit", ({ invalidUnit }) => {
    expect(isValidDateUnit(invalidUnit)).toBe(false);
  });
});
