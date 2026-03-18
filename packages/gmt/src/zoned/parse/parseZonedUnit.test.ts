import { sameInstantBattleCases } from "../test/timezoneFixtures";
import { parseZonedUnit } from "./parseZonedUnit";

describe("parseZonedUnit", () => {
  it.each`
    value                                                | unit             | expected
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"year"}        | ${"2024"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"month"}       | ${"03"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"day"}         | ${"17"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"hour"}        | ${"14"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"minute"}      | ${"30"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"second"}      | ${"45"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"millisecond"} | ${"123"}
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"} | ${"timezone"}    | ${"America/New_York"}
  `("returns $expected for valid unit $unit", ({ value, unit, expected }) => {
    expect(parseZonedUnit(value, unit)).toBe(expected);
  });

  it.each`
    value                          | unit          | expected
    ${"2024-03-17T14:30:45Z[UTC]"} | ${"timezone"} | ${"UTC"}
  `(
    "returns $expected for edge case unit $unit",
    ({ value, unit, expected }) => {
      expect(parseZonedUnit(value, unit)).toBe(expected);
    },
  );

  it.each`
    invalidValue
    ${"2024-03-17T14:30:45.123-04:00"}
    ${"invalid"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid zoned datetime $invalidValue",
    ({ invalidValue }) => {
      expect(parseZonedUnit(invalidValue as never, "year")).toBe("");
    },
  );

  it.each`
    invalidUnit
    ${"week"}
    ${"microsecond"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid unit $invalidUnit",
    ({ invalidUnit }) => {
      expect(
        parseZonedUnit(
          "2024-03-17T14:30:45.123-04:00[America/New_York]",
          invalidUnit as never,
        ),
      ).toBe("");
    },
  );

  for (const { timeZone, value } of sameInstantBattleCases) {
    it(`returns timezone unit for battle-test timezone ${timeZone}`, () => {
      expect(parseZonedUnit(value, "timezone")).toBe(timeZone);
    });
  }
});
