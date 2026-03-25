import { startOfZoned } from "./startOfZoned";

describe("startOfZoned", () => {
  it.each`
    value                                         | unit             | expected
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"year"}        | ${"2024-01-01T00:00:00+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"month"}       | ${"2024-02-01T00:00:00+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"week"}        | ${"2024-02-26T00:00:00+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"day"}         | ${"2024-02-29T00:00:00+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"hour"}        | ${"2024-02-29T12:00:00+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"minute"}      | ${"2024-02-29T12:34:00+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"second"}      | ${"2024-02-29T12:34:56+00:00[UTC]"}
    ${"2024-02-29T12:34:56+00:00[UTC]"}           | ${"millisecond"} | ${"2024-02-29T12:34:56.000+00:00.000[UTC]"}
    ${"2024-02-29T12:34:56.999999999+00:00[UTC]"} | ${"microsecond"} | ${"2024-02-29T12:34:56.000000+00:00.000000[UTC]"}
    ${"2024-02-29T12:34:56.999999999+00:00[UTC]"} | ${"nanosecond"}  | ${"2024-02-29T12:34:56.000000000+00:00.000000000[UTC]"}
  `(
    "returns $expected for value $value and unit $unit",
    ({ value, unit, expected }) => {
      expect(startOfZoned(value, unit)).toBe(expected);
    },
  );

  // invalid value
  it.each`
    invalidZonedDateTime
    ${"invalid-zoned-datetime"}
    ${"2024-02-30T12:34:56+00:00[UTC]"}
    ${"2024-02-29T24:00:00+00:00[UTC]"}
    ${"2024-02-29T12:60:00+00:00[UTC]"}
    ${"2024-02-29T12:34:60+00:00[UTC]"}
    ${null}
    ${undefined}
    ${12}
    ${true}
    ${false}
  `(
    "returns empty string for invalid zoned datetime $invalidZonedDateTime",
    ({ invalidZonedDateTime }) => {
      expect(startOfZoned(invalidZonedDateTime, "month")).toBe("");
    },
  );

  // invalid unit
  it.each`
    invalidUnit
    ${"invalid-unit"}
    ${""}
    ${null}
    ${undefined}
    ${12}
    ${true}
    ${false}
  `("returns empty string for invalid unit $invalidUnit", ({ invalidUnit }) => {
    expect(startOfZoned("2024-02-29T12:34:56+00:00[UTC]", invalidUnit)).toBe(
      "",
    );
  });
});
