import { isValidDate } from "./isValidDate";

describe("isValidDate", () => {
  it.each(["2026-01-31", "2024-02-29"])(
    "returns true for valid date: %s",
    (value) => {
      expect(isValidDate(value)).toBe(true);
    },
  );

  it.each(["2026-1-31", "2026-02-30", "2023-02-29", "not-a-date"])(
    "returns false for invalid date: %s",
    (value) => {
      expect(isValidDate(value)).toBe(false);
    },
  );
});
