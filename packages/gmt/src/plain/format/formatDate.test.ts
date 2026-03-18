import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it.each`
    value           | locale     | options                                               | expectedParts
    ${"2024-03-17"} | ${"en-US"} | ${{ year: "numeric", month: "long", day: "numeric" }} | ${["2024", "17"]}
  `(
    "formats valid date $value",
    ({ value, locale, options, expectedParts }) => {
      const result = formatDate(value, locale, options);

      expect(result).toMatch(/march/i);
      expectedParts.forEach((part: string) => {
        expect(result).toContain(part);
      });
    },
  );

  it.each`
    value           | locale     | options
    ${"2024-03-17"} | ${"en-GB"} | ${{ year: "numeric", month: "2-digit", day: "2-digit" }}
  `(
    "formats edge case date $value with alternate locale",
    ({ value, locale, options }) => {
      expect(formatDate(value, locale, options)).not.toBe("");
    },
  );

  it.each`
    invalidValue
    ${"not-a-date"}
    ${"2024-02-30"}
    ${"2024-03-17T12:00:00"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns an empty string for invalid date $invalidValue",
    ({ invalidValue }) => {
      expect(formatDate(invalidValue as never)).toBe("");
    },
  );
});
