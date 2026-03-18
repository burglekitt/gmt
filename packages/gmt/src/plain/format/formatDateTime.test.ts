import { formatDateTime } from "./formatDateTime";

describe("formatDateTime", () => {
  it.each`
    value                    | locale     | options                                                                                                  | expectedParts
    ${"2024-03-17T14:30:45"} | ${"en-US"} | ${{ year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }} | ${["2024", "14", "30"]}
  `(
    "formats valid datetime $value",
    ({ value, locale, options, expectedParts }) => {
      const result = formatDateTime(value, locale, options);

      expect(result).toMatch(/march/i);
      expectedParts.forEach((part: string) => {
        expect(result).toContain(part);
      });
    },
  );

  it.each`
    value                        | locale     | options
    ${"2024-03-17T14:30:45.123"} | ${"en-GB"} | ${{ year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }}
  `("formats edge case datetime $value", ({ value, locale, options }) => {
    expect(formatDateTime(value, locale, options)).not.toBe("");
  });

  it.each`
    invalidValue
    ${"not-a-datetime"}
    ${"2024-03-17"}
    ${"2024-03-17T24:00:00"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns an empty string for invalid datetime $invalidValue",
    ({ invalidValue }) => {
      expect(formatDateTime(invalidValue as never)).toBe("");
    },
  );
});
