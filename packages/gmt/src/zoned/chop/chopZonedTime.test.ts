import { isValidDate } from "../../plain/validate/isValidDate";
import { sameInstantBattleCases } from "../test/timezoneFixtures";
import { chopZonedTime } from "./chopZonedTime";

describe("chopZonedTime", () => {
  it.each`
    value                                            | expected
    ${"2024-03-17T12:30:45+01:00[Europe/Paris]"}     | ${"2024-03-17"}
    ${"2024-03-17T14:30:45+00:00[UTC]"}              | ${"2024-03-17"}
    ${"2024-03-17T09:30:45-05:00[America/Chicago]"}  | ${"2024-03-17"}
    ${"2024-03-17T12:30:45.123+01:00[Europe/Paris]"} | ${"2024-03-17"}
    ${"2024-03-17T00:00:00+00:00[UTC]"}              | ${"2024-03-17"}
    ${"2024-03-17T23:59:59.999+00:00[UTC]"}          | ${"2024-03-17"}
    ${"2024-03-17T12:30:45Z[UTC]"}                   | ${"2024-03-17"}
  `(
    "returns $expected for $value",
    ({ value, expected }: { value: string; expected: string }) => {
      expect(chopZonedTime(value)).toBe(expected);
    },
  );

  it.each`
    invalidValue
    ${"2024-03-17"}
    ${"12:30:45"}
    ${"2024-03-17T12:30:45"}
    ${"2024-03-17T12:30:45Z"}
    ${"not-a-datetime"}
    ${""}
    ${NaN}
    ${null}
    ${undefined}
    ${true}
    ${false}
  `("returns empty string for $invalidValue", ({ invalidValue }) => {
    expect(chopZonedTime(invalidValue)).toBe("");
  });

  for (const { timeZone, value } of sameInstantBattleCases) {
    it(`returns a valid plain date for battle-test timezone ${timeZone}`, () => {
      const result = chopZonedTime(value);
      expect(isValidDate(result)).toBe(true);
    });
  }
});
