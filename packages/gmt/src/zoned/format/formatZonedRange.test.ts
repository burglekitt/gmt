import { Temporal } from "@js-temporal/polyfill";
import { localNoonBattleCases } from "../test/timezoneFixtures";
import { formatZonedRange } from "./formatZonedRange";

describe("formatZonedRange", () => {
  it.each`
    value1                         | value2                         | locale     | options
    ${"2024-03-17T09:00:00Z[UTC]"} | ${"2024-03-17T17:00:00Z[UTC]"} | ${"en-US"} | ${{ hour: "2-digit", minute: "2-digit", hour12: false }}
  `(
    "returns a non-empty string for valid range",
    ({ value1, value2, locale, options }) => {
      const result = formatZonedRange(value1, value2, locale, options);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    },
  );

  it.each`
    value1                                           | value2                                           | locale     | options
    ${"2024-03-17T09:00:00-04:00[America/New_York]"} | ${"2024-03-17T10:00:00-04:00[America/New_York]"} | ${"en-US"} | ${{ hour: "2-digit", minute: "2-digit", hour12: false }}
  `(
    "returns a non-empty string for edge case range",
    ({ value1, value2, locale, options }) => {
      expect(formatZonedRange(value1, value2, locale, options)).not.toBe("");
    },
  );

  it.each`
    invalidValue1             | value2
    ${"not-a-zoned-datetime"} | ${"2024-03-17T17:00:00Z[UTC]"}
    ${"2024-03-17T09:00:00"}  | ${"2024-03-17T17:00:00Z[UTC]"}
    ${""}                     | ${"2024-03-17T17:00:00Z[UTC]"}
    ${null}                   | ${"2024-03-17T17:00:00Z[UTC]"}
    ${undefined}              | ${"2024-03-17T17:00:00Z[UTC]"}
  `(
    "returns an empty string for invalid first value $invalidValue1",
    ({ invalidValue1, value2 }) => {
      expect(formatZonedRange(invalidValue1 as never, value2)).toBe("");
    },
  );

  it.each`
    value1                         | invalidValue2
    ${"2024-03-17T09:00:00Z[UTC]"} | ${"not-a-zoned-datetime"}
    ${"2024-03-17T09:00:00Z[UTC]"} | ${"2024-03-17T17:00:00"}
    ${"2024-03-17T09:00:00Z[UTC]"} | ${""}
    ${"2024-03-17T09:00:00Z[UTC]"} | ${null}
    ${"2024-03-17T09:00:00Z[UTC]"} | ${undefined}
  `(
    "returns an empty string for invalid second value $invalidValue2",
    ({ value1, invalidValue2 }) => {
      expect(formatZonedRange(value1, invalidValue2 as never)).toBe("");
    },
  );

  for (const { timeZone, value } of localNoonBattleCases) {
    it(`formats a battle-test zoned range in ${timeZone}`, () => {
      const end = Temporal.ZonedDateTime.from(value)
        .add({ hours: 1 })
        .toString();
      expect(formatZonedRange(value, end, "en-US")).not.toBe("");
    });
  }
});
