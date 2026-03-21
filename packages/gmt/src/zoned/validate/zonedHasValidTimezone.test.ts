import {
  sameInstantBattleCases,
  unixEpochBattleCases,
} from "../test/timezoneFixtures";
import { zonedHasValidTimezone } from "./zonedHasValidTimezone";

const invalidHistoricalKathmanduOffset =
  "1970-01-01T05:45:00+05:45[Asia/Kathmandu]";

describe("zonedHasValidTimezone", () => {
  for (const { timeZone, value } of sameInstantBattleCases) {
    it(`returns true for current must-test timezone ${timeZone}`, () => {
      expect(zonedHasValidTimezone(value)).toBe(true);
    });
  }

  for (const { timeZone, value } of unixEpochBattleCases) {
    it(`returns true for historical must-test timezone ${timeZone}`, () => {
      expect(zonedHasValidTimezone(value)).toBe(true);
    });
  }

  it.each`
    value
    ${invalidHistoricalKathmanduOffset}
    ${"2024-02-29T09:00:00+00:00"}
    ${"2024-02-29T09:00:00+00:00[Not/AZone]"}
    ${""}
  `("returns false for invalid time zone $value", ({ value }) => {
    expect(zonedHasValidTimezone(value)).toBe(false);
  });
});
