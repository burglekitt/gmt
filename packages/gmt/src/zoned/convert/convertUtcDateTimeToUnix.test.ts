import { convertUtcDateTimeToUnix } from "./convertUtcDateTimeToUnix";

describe("convertUtcDateTimeToUnix", () => {
  it.each`
    value                        | unit              | expected
    ${"1970-01-01T00:00:00"}     | ${"milliseconds"} | ${0}
    ${"1970-01-01T00:00:00"}     | ${"seconds"}      | ${0}
    ${"2024-03-17T09:00:00"}     | ${"milliseconds"} | ${1710666000000}
    ${"2024-03-17T09:00:00"}     | ${"seconds"}      | ${1710666000}
    ${"2024-03-17T09:00:00.900"} | ${"milliseconds"} | ${1710666000900}
    ${"2024-03-17T09:00:00.900"} | ${"seconds"}      | ${1710666000}
    ${"2024-03-17T09:00:00.001"} | ${"milliseconds"} | ${1710666000001}
    ${"2024-03-17T09:00:00.001"} | ${"seconds"}      | ${1710666000}
  `("returns $expected for $value in $unit", ({ value, unit, expected }) => {
    expect(convertUtcDateTimeToUnix(value, unit)).toBe(expected);
  });

  it("defaults to milliseconds when unit is omitted", () => {
    expect(convertUtcDateTimeToUnix("2024-03-17T09:00:00")).toBe(1710666000000);
  });

  it.each`
    invalidValue
    ${"not-a-utc-datetime"}
    ${"2024-03-17"}
    ${"2024-03-17T09:00:00Z"}
    ${"2024-03-17T09:00:00+00:00[UTC]"}
    ${""}
    ${null}
    ${undefined}
  `("returns null for invalid value $invalidValue", ({ invalidValue }) => {
    expect(convertUtcDateTimeToUnix(invalidValue as never)).toBeNull();
  });

  it.each`
    invalidUnit
    ${"minutes"}
    ${""}
    ${null}
    ${undefined}
  `("returns null for invalid unit $invalidUnit", ({ invalidUnit }) => {
    expect(
      convertUtcDateTimeToUnix("2024-03-17T09:00:00", invalidUnit as never),
    ).toBeNull();
  });
});
