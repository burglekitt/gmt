import { isValidDateTime } from "./isValidDateTime";

describe("isValidDateTime", () => {
  it.each(["2026-01-31T23:59:59", "2024-02-29T08:30:45.123"])(
    "returns true for valid date-time: %s",
    (value) => {
      expect(isValidDateTime(value)).toBe(true);
    },
  );

  it.each([
    "2026-1-31T23:59:59",
    "2026-02-30T12:00:00",
    "2026-01-31 23:59:59",
    "2026-01-31T24:00:00",
  ])("returns false for invalid date-time: %s", (value) => {
    expect(isValidDateTime(value)).toBe(false);
  });
});
