import { convertToUnixSeconds } from "./convertToUnixSeconds";

describe("convertToUnixSeconds", () => {
  it.each`
    value                                            | expected
    ${"1970-01-01T00:00:00+00:00[UTC]"}              | ${0}
    ${"2024-03-17T09:00:00+00:00[UTC]"}              | ${1710666000}
    ${"2024-03-17T05:00:00-04:00[America/New_York]"} | ${1710666000}
  `(
    "returns $expected for $value",
    ({ value, expected }: { value: string; expected: number }) => {
      expect(convertToUnixSeconds(value)).toBe(expected);
    },
  );

  it("throws for an invalid zoned datetime", () => {
    expect(() => convertToUnixSeconds("not-a-zoned-datetime")).toThrow();
  });
});
