import { battleTestTimeZones } from "../test/timezoneFixtures";
import { getZonedToday } from "./getZonedToday";

describe("getZonedToday", () => {
  it.each`
    timeZone
    ${"UTC"}
    ${"America/New_York"}
  `(
    "returns an ISO date string for valid timezone $timeZone",
    ({ timeZone }) => {
      const value = getZonedToday(timeZone);
      expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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
      expect(getZonedToday(invalidTimeZone as never)).toBe("");
    },
  );

  for (const timeZone of battleTestTimeZones) {
    it(`returns an ISO date for battle-test timezone ${timeZone}`, () => {
      expect(getZonedToday(timeZone)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  }
});
