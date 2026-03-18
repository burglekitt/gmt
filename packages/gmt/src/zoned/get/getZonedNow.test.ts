import { parseZonedTimezone } from "../parse";
import { battleTestTimeZones } from "../test/timezoneFixtures";
import { getZonedNow } from "./getZonedNow";

describe("getZonedNow", () => {
  it.each`
    timeZone
    ${"UTC"}
    ${"America/New_York"}
  `(
    "returns a zoned datetime string for valid timezone $timeZone",
    ({ timeZone }) => {
      const value = getZonedNow(timeZone);
      expect(value).not.toBe("");
      expect(parseZonedTimezone(value)).toBe(timeZone);
    },
  );

  it.each`
    invalidTimeZone
    ${"Mars/Olympus"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid timezone $invalidTimeZone",
    ({ invalidTimeZone }) => {
      expect(getZonedNow(invalidTimeZone as never)).toBe("");
    },
  );

  for (const timeZone of battleTestTimeZones) {
    it(`returns a zoned datetime for battle-test timezone ${timeZone}`, () => {
      const value = getZonedNow(timeZone);
      expect(value).not.toBe("");
      expect(parseZonedTimezone(value)).toBe(timeZone);
    });
  }
});
