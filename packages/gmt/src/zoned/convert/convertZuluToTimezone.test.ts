import { parseZonedTimezone } from "../parse";
import { battleTestTimeZones } from "../test/timezoneFixtures";
import { convertZuluToTimezone } from "./convertZuluToTimezone";

describe("convertZuluToTimezone", () => {
  it.each`
    value                     | timeZone              | expected
    ${"2024-03-17T14:30:45Z"} | ${"UTC"}              | ${"2024-03-17T14:30:45+00:00[UTC]"}
    ${"2024-03-17T14:30:45Z"} | ${"America/New_York"} | ${"2024-03-17T10:30:45-04:00[America/New_York]"}
  `(
    "returns $expected for $value in $timeZone",
    ({ value, timeZone, expected }) => {
      expect(convertZuluToTimezone(value, timeZone)).toBe(expected);
    },
  );

  it.each`
    invalidValue
    ${"invalid"}
    ${"2024-03-17T14:30:45"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for invalid zulu datetime $invalidValue",
    ({ invalidValue }) => {
      expect(convertZuluToTimezone(invalidValue as never, "UTC")).toBe("");
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
      expect(
        convertZuluToTimezone("2024-03-17T14:30:45Z", invalidTimeZone as never),
      ).toBe("");
    },
  );

  for (const timeZone of battleTestTimeZones) {
    it(`converts zulu to battle-test timezone ${timeZone}`, () => {
      expect(
        parseZonedTimezone(
          convertZuluToTimezone("2024-03-17T14:30:45Z", timeZone),
        ),
      ).toBe(timeZone);
    });
  }
});
