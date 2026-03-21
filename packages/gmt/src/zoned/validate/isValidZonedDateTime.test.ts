import {
  invalidHistoricalKathmanduOffset,
  localNoonBattleCases,
  sameInstantBattleCases,
  unixEpochBattleCases,
  validOnlyBattleTestTimeZones,
} from "../test/timezoneFixtures";
import { isValidZonedDateTime } from ".";

describe("isValidZonedDateTime", () => {
  it.each`
    value
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"}
    ${"2024-03-17T14:30:45.123[America/New_York]"}
    ${"2024-03-17T14:30:45Z[UTC]"}
  `(
    "returns true for valid zoned datetime: $value",
    ({ value }: { value: string }) => {
      expect(isValidZonedDateTime(value)).toBe(true);
    },
  );

  for (const timeZone of validOnlyBattleTestTimeZones) {
    it(`accepts valid fixture timezone without explicit offset: ${timeZone}`, () => {
      expect(isValidZonedDateTime(`2024-03-17T14:30:45.123[${timeZone}]`)).toBe(
        true,
      );
    });
  }

  for (const { timeZone, value } of localNoonBattleCases) {
    it(`accepts local-noon fixture zoned datetime in ${timeZone}`, () => {
      expect(isValidZonedDateTime(value)).toBe(true);
    });
  }

  it.each`
    value
    ${"2024-03-17T14:30:60[America/New_York]"}
    ${"2024-03-17T14:30:60.123[America/New_York]"}
    ${"2024-03-17T14:30:60+05:00[Asia/Kolkata]"}
    ${"2024-03-17T14:30:60-08:00[America/Los_Angeles]"}
    ${"2024-03-17T14:30:60Z[UTC]"}
  `(
    "returns false for leap second with zoned datetime: $value",
    ({ value }: { value: string }) => {
      expect(isValidZonedDateTime(value)).toBe(false);
    },
  );

  it.each`
    value
    ${"2024-03-17T14:30:45.123-04:00"}
    ${"2024-03-17T14:30:45Z"}
    ${"2024-03-17T14:30:60Z[UTC]"}
    ${invalidHistoricalKathmanduOffset}
    ${"2024-03-17T14:30:45.123-04:00[Not/AZone]"}
    ${"not-a-zoned-datetime"}
  `(
    "returns false for invalid zoned datetime: $value",
    ({ value }: { value: string }) => {
      expect(isValidZonedDateTime(value)).toBe(false);
    },
  );

  for (const { timeZone, value } of sameInstantBattleCases) {
    it(`accepts battle-test zoned datetime in ${timeZone}`, () => {
      expect(isValidZonedDateTime(value)).toBe(true);
    });
  }

  for (const { timeZone, value } of unixEpochBattleCases) {
    it(`accepts historical epoch zoned datetime in ${timeZone}`, () => {
      expect(isValidZonedDateTime(value)).toBe(true);
    });
  }
});
