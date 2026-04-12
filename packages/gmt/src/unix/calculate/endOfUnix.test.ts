import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { endOfUnix } from "./endOfUnix";

describe("endOfUnix", () => {
  let timeZoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    timeZoneSpy = vi
      .spyOn(getSystemTimezoneModule, "getSystemTimezone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timeZoneSpy.mockRestore();
  });

  it.each`
    value           | unit        | expected
    ${"1704067200"} | ${"year"}   | ${"1735689599"}
    ${1706659200}   | ${"month"}  | ${"1706745599"}
    ${1706659200}   | ${"day"}    | ${"1706745599"}
    ${1706659200}   | ${"hour"}   | ${"1706662799"}
    ${1706659200}   | ${"minute"} | ${"1706659259"}
    ${1706659200}   | ${"second"} | ${"1706659200"}
  `(
    "returns $expected for value $value and unit $unit",
    ({ value, unit, expected }) => {
      expect(
        endOfUnix(value as never, unit as never, { epochUnit: "seconds" }),
      ).toBe(expected);
    },
  );

  it.each`
    value           | unit      | weekStartsOn | expected
    ${"1706659200"} | ${"week"} | ${"monday"}  | ${"1707091199"}
    ${"1706659200"} | ${"week"} | ${"sunday"}  | ${"1707004799"}
  `(
    "supports weekStartsOn $weekStartsOn returning $expected for value $value and unit $unit",
    ({ value, unit, weekStartsOn, expected }) => {
      expect(
        endOfUnix(value as never, unit as never, {
          epochUnit: "seconds",
          weekStartsOn,
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
      expect(endOfUnix(invalidValue as never, "day" as never)).toBe("");
    },
  );

  it.each`
    invalidUnit
    ${"invalid-unit"}
    ${""}
    ${null}
    ${undefined}
  `("returns empty string for invalid unit $invalidUnit", ({ invalidUnit }) => {
    expect(endOfUnix(1706659200, invalidUnit as never)).toBe("");
  });
});
