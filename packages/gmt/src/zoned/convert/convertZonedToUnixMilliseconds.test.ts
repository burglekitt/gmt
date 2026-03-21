import {
  sameInstantBattleCases,
  unixEpochBattleCases,
} from "../test/timezoneFixtures";

import { convertZonedToUnixMilliseconds } from "./convertZonedToUnixMilliseconds";

const invalidHistoricalKathmanduOffset =
  "1970-01-01T05:45:00+05:45[Asia/Kathmandu]";

describe("convertZonedToUnixMilliseconds", () => {
  for (const { timeZone, value, unixMilliseconds } of sameInstantBattleCases) {
    it(`returns shared epoch milliseconds for must-test timezone ${timeZone}`, () => {
      expect(convertZonedToUnixMilliseconds(value)).toBe(unixMilliseconds);
    });
  }

  for (const { timeZone, value, unixMilliseconds } of unixEpochBattleCases) {
    it(`returns epoch milliseconds for historical must-test timezone ${timeZone}`, () => {
      expect(convertZonedToUnixMilliseconds(value)).toBe(unixMilliseconds);
    });
  }

  it.each`
    value
    ${"1970-01-01T00:00:00+00:00[Etc/UTC]"}
  `("returns a number for edge case zoned datetime $value", ({ value }) => {
    expect(convertZonedToUnixMilliseconds(value)).not.toBeNull();
  });

  it.each`
    invalidValue
    ${"not-a-zoned-datetime"}
    ${"2024-02-29T09:00:00+00:00"}
    ${invalidHistoricalKathmanduOffset}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns null for invalid zoned datetime $invalidValue",
    ({ invalidValue }) => {
      expect(convertZonedToUnixMilliseconds(invalidValue as never)).toBeNull();
    },
  );
});
