import { isValidDate } from "../../plain/validate";
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
      expect(isValidDate(value)).toBe(true);
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
      expect(isValidDate(getZonedToday(timeZone))).toBe(true);
    });
  }
});
