import { parseZonedTimezone } from "../parse";
import { localNoonBattleCases } from "../test/timezoneFixtures";
import { addZoned } from "./addZoned";

describe("addZoned", () => {
  it.each`
    value                               | amount | unit             | expected
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"year"}        | ${"2025-03-17T14:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"month"}       | ${"2024-04-17T14:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${2}   | ${"week"}        | ${"2024-03-31T14:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${1}   | ${"day"}         | ${"2024-03-18T14:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${2}   | ${"hour"}        | ${"2024-03-17T16:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${45}  | ${"minute"}      | ${"2024-03-17T15:15:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${45}  | ${"second"}      | ${"2024-03-17T14:30:45+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${250} | ${"millisecond"} | ${"2024-03-17T14:30:00.25+00:00[UTC]"}
  `(
    "returns $expected for $value + $amount $unit",
    ({ value, amount, unit, expected }) => {
      expect(addZoned(value, amount, unit)).toBe(expected);
    },
  );

  it.each`
    value                               | amount | unit        | expected
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${-1}  | ${"hour"}   | ${"2024-03-17T13:30:00+00:00[UTC]"}
    ${"2024-03-17T14:30:00+00:00[UTC]"} | ${-30} | ${"minute"} | ${"2024-03-17T14:00:00+00:00[UTC]"}
  `(
    "returns $expected for negative amount $amount",
    ({ value, amount, unit, expected }) => {
      expect(addZoned(value, amount, unit)).toBe(expected);
    },
  );

  it.each`
    invalidValue
    ${"invalid"}
    ${"2024-03-17T14:30:00"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid zoned datetime $invalidValue",
    ({ invalidValue }) => {
      expect(addZoned(invalidValue as never, 1, "hour")).toBe("");
    },
  );

  it.each`
    invalidAmount
    ${NaN}
    ${null}
    ${undefined}
    ${"1"}
  `(
    "returns an empty string for invalid amount $invalidAmount",
    ({ invalidAmount }) => {
      expect(
        addZoned(
          "2024-03-17T14:30:00+00:00[UTC]",
          invalidAmount as never,
          "hour",
        ),
      ).toBe("");
    },
  );

  it.each`
    invalidUnit
    ${"timezone"}
    ${"microsecond"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid unit $invalidUnit",
    ({ invalidUnit }) => {
      expect(
        addZoned("2024-03-17T14:30:00+00:00[UTC]", 1, invalidUnit as never),
      ).toBe("");
    },
  );

  for (const { timeZone, value } of localNoonBattleCases) {
    it(`preserves battle-test timezone ${timeZone} when adding`, () => {
      expect(parseZonedTimezone(addZoned(value, 1, "hour"))).toBe(timeZone);
    });
  }
});
