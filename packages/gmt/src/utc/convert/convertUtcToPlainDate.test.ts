import { convertUtcToPlainDate } from "./convertUtcToPlainDate";

describe("convertUtcToPlainDate", () => {
  it.each`
    value                     | expected
    ${"2024-02-29T00:00:00Z"} | ${"2024-02-29"}
    ${"2024-01-01T00:00:00Z"} | ${"2024-01-01"}
    ${"2024-03-01T15:00:00Z"} | ${"2024-03-01"}
  `("returns $expected for UTC value $value", ({ value, expected }) => {
    expect(convertUtcToPlainDate(value)).toBe(expected);
  });

  it.each`
    value                     | timezone              | expected
    ${"2024-02-29T00:00:00Z"} | ${"UTC"}              | ${"2024-02-29"}
    ${"2024-02-29T00:00:00Z"} | ${"America/New_York"} | ${"2024-02-28"}
  `(
    "returns $expected for UTC value $value in timezone $timezone",
    ({ value, timezone, expected }) => {
      expect(convertUtcToPlainDate(value, { timezone })).toBe(expected);
    },
  );

  it.each`
    value
    ${"invalid"}
    ${"2024-02-29T00:00:00"}
    ${""}
    ${null}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(convertUtcToPlainDate(value as never)).toBe("");
  });
});
