import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { startOfUnix } from "./startOfUnix";

describe("startOfUnix", () => {
  let timezoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    timezoneSpy = vi
      .spyOn(getSystemTimezoneModule, "getSystemTimezone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timezoneSpy.mockRestore();
  });

  it.each`
    value           | unit        | expected
    ${"1706659200"} | ${"year"}   | ${"1704067200"}
    ${1706659200}   | ${"month"}  | ${"1704067200"}
    ${1706780800}   | ${"day"}    | ${"1706745600"}
    ${1706780800}   | ${"hour"}   | ${"1706778000"}
    ${1706780800}   | ${"minute"} | ${"1706780760"}
    ${1706659200}   | ${"second"} | ${"1706659200"}
  `(
    "returns $expected for value $value and unit $unit",
    ({ value, unit, expected }) => {
      expect(
        startOfUnix(value as never, unit as never, { epochUnit: "seconds" }),
      ).toBe(expected);
    },
  );

  it.each`
    value           | unit      | weekStartsOn | expected
    ${"1706659200"} | ${"week"} | ${"monday"}  | ${"1706486400"}
    ${"1706659200"} | ${"week"} | ${"sunday"}  | ${"1706400000"}
  `(
    "supports weekStartsOn $weekStartsOn returning $expected for value $value and unit $unit",
    ({ value, unit, weekStartsOn, expected }) => {
      expect(
        startOfUnix(value as never, unit as never, {
          epochUnit: "seconds",
          weekStartsOn,
        }),
      ).toBe(expected);
    },
  );

  it.each`
    value           | unit        | fractionalSecondDigits | expected
    ${"1706659200"} | ${"second"} | ${undefined}           | ${"1706659200"}
    ${1706659200}   | ${"second"} | ${3}                   | ${"1706659200"}
  `(
    "supports fractionalSecondDigits $fractionalSecondDigits returning $expected for $value and $unit",
    ({ value, unit, fractionalSecondDigits, expected }) => {
      expect(
        startOfUnix(value as never, unit as never, {
          epochUnit: "seconds",
          fractionalSecondDigits,
        }),
      ).toBe(expected);
    },
  );

  it.each`
    invalidValue
    ${"invalid"}
    ${-1}
    ${1.5}
    ${null}
    ${undefined}
  `(
    "returns empty string for invalid value $invalidValue",
    ({ invalidValue }) => {
      expect(startOfUnix(invalidValue as never, "day" as never)).toBe("");
    },
  );

  it.each`
    invalidUnit
    ${"invalid-unit"}
    ${""}
    ${null}
    ${undefined}
  `("returns empty string for invalid unit $invalidUnit", ({ invalidUnit }) => {
    expect(startOfUnix(1706659200, invalidUnit as never)).toBe("");
  });
});
