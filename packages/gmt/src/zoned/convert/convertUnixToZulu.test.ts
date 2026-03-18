import { convertUnixToZulu } from "./convertUnixToZulu";

describe("convertUnixToZulu", () => {
  it.each`
    value            | unit              | expected
    ${0}             | ${"milliseconds"} | ${"1970-01-01T00:00:00Z"}
    ${0}             | ${"seconds"}      | ${"1970-01-01T00:00:00Z"}
    ${1710685845000} | ${"milliseconds"} | ${"2024-03-17T14:30:45Z"}
    ${1710685845}    | ${"seconds"}      | ${"2024-03-17T14:30:45Z"}
  `("returns $expected for $value in $unit", ({ value, unit, expected }) => {
    expect(convertUnixToZulu(value, unit)).toBe(expected);
  });

  it.each`
    invalidValue
    ${NaN}
    ${Infinity}
    ${-Infinity}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid unix value $invalidValue",
    ({ invalidValue }) => {
      expect(convertUnixToZulu(invalidValue as never)).toBe("");
    },
  );

  it.each`
    invalidUnit
    ${"minutes"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid unit $invalidUnit",
    ({ invalidUnit }) => {
      expect(convertUnixToZulu(0, invalidUnit as never)).toBe("");
    },
  );
});
