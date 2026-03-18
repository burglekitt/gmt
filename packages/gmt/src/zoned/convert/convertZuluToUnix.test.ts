import { convertZuluToUnix } from "./convertZuluToUnix";

describe("convertZuluToUnix", () => {
  it.each`
    value                     | unit              | expected
    ${"1970-01-01T00:00:00Z"} | ${"milliseconds"} | ${0}
    ${"1970-01-01T00:00:00Z"} | ${"seconds"}      | ${0}
    ${"2024-03-17T14:30:45Z"} | ${"milliseconds"} | ${1710685845000}
    ${"2024-03-17T14:30:45Z"} | ${"seconds"}      | ${1710685845}
  `("returns $expected for $value as $unit", ({ value, unit, expected }) => {
    expect(convertZuluToUnix(value, unit)).toBe(expected);
  });

  it.each`
    invalidValue
    ${"invalid"}
    ${"2024-03-17T14:30:45"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns null for invalid zulu datetime $invalidValue",
    ({ invalidValue }) => {
      expect(convertZuluToUnix(invalidValue as never)).toBeNull();
    },
  );

  it.each`
    invalidUnit
    ${"minutes"}
    ${""}
    ${null}
    ${undefined}
  `("returns null for invalid unit $invalidUnit", ({ invalidUnit }) => {
    expect(
      convertZuluToUnix("2024-03-17T14:30:45Z", invalidUnit as never),
    ).toBeNull();
  });
});
