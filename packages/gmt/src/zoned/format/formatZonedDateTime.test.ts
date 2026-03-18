import { sameInstantBattleCases } from "../test/timezoneFixtures";
import { formatZonedDateTime } from "./formatZonedDateTime";

describe("formatZonedDateTime", () => {
  it.each`
    value                                            | locale     | options                                                                                                  | expectedParts
    ${"2024-03-17T14:30:45-04:00[America/New_York]"} | ${"en-US"} | ${{ year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }} | ${["2024", "14", "30"]}
  `(
    "formats valid zoned datetime $value",
    ({ value, locale, options, expectedParts }) => {
      const result = formatZonedDateTime(value, locale, options);

      expect(result).toMatch(/march/i);
      expectedParts.forEach((part: string) => {
        expect(result).toContain(part);
      });
    },
  );

  it.each`
    value                                            | locale     | options
    ${"2024-03-10T12:00:00-04:00[America/New_York]"} | ${"en-US"} | ${{ year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }}
  `("formats edge case zoned datetime $value", ({ value, locale, options }) => {
    expect(formatZonedDateTime(value, locale, options)).not.toBe("");
  });

  it.each`
    invalidValue
    ${"not-a-zoned-datetime"}
    ${"2024-03-17T14:30:45"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid zoned datetime $invalidValue",
    ({ invalidValue }) => {
      expect(formatZonedDateTime(invalidValue as never)).toBe("");
    },
  );

  for (const { timeZone, value } of sameInstantBattleCases) {
    it(`formats a battle-test zoned datetime in ${timeZone}`, () => {
      expect(formatZonedDateTime(value, "en-US")).not.toBe("");
    });
  }
});
