import { parseZonedTimezone } from "../parse";
import { battleTestTimeZones } from "../test/timezoneFixtures";
import { convertUnixToTimezone } from "./convertUnixToTimezone";

describe("convertUnixToTimezone", () => {
  it.each`
    value            | timeZone              | unit              | expected
    ${0}             | ${"UTC"}              | ${"milliseconds"} | ${"1970-01-01T00:00:00+00:00[UTC]"}
    ${0}             | ${"UTC"}              | ${"seconds"}      | ${"1970-01-01T00:00:00+00:00[UTC]"}
    ${1710666000000} | ${"America/New_York"} | ${"milliseconds"} | ${"2024-03-17T05:00:00-04:00[America/New_York]"}
    ${1710666000}    | ${"America/New_York"} | ${"seconds"}      | ${"2024-03-17T05:00:00-04:00[America/New_York]"}
  `(
    "returns $expected for $value in $timeZone using $unit",
    ({ value, timeZone, unit, expected }) => {
      expect(convertUnixToTimezone(value, timeZone, unit)).toBe(expected);
    },
  );

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
      expect(convertUnixToTimezone(invalidValue as never, "UTC")).toBe("");
    },
  );

  for (const timeZone of battleTestTimeZones) {
    it(`returns a battle-test timezone result for ${timeZone}`, () => {
      expect(
        parseZonedTimezone(convertUnixToTimezone(1710685845000, timeZone)),
      ).toBe(timeZone);
    });
  }
});
