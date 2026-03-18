import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it.each`
    value         | locale     | options                                                                     | expectedParts
    ${"14:30:45"} | ${"en-US"} | ${{ hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }} | ${["14", "30", "45"]}
  `(
    "formats valid time $value",
    ({ value, locale, options, expectedParts }) => {
      const result = formatTime(value, locale, options);

      expectedParts.forEach((part: string) => {
        expect(result).toContain(part);
      });
    },
  );

  it.each`
    value             | locale     | options
    ${"14:30:45.123"} | ${"en-GB"} | ${{ hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }}
  `("formats edge case time $value", ({ value, locale, options }) => {
    expect(formatTime(value, locale, options)).not.toBe("");
  });

  it.each`
    invalidValue
    ${"not-a-time"}
    ${"24:00:00"}
    ${"2024-03-17T14:30:45"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns an empty string for invalid time $invalidValue",
    ({ invalidValue }) => {
      expect(formatTime(invalidValue as never)).toBe("");
    },
  );
});
