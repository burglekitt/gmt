import { formatZonedRange } from "./formatZonedRange";

describe("formatZonedRange", () => {
  it("returns a non-empty string for valid inputs", () => {
    const result = formatZonedRange(
      "2024-03-17T09:00:00[UTC]",
      "2024-03-17T17:00:00[UTC]",
      "en-US",
      { hour: "2-digit", minute: "2-digit", hour12: false },
    );
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("throws for an invalid zoned datetime string", () => {
    expect(() =>
      formatZonedRange("not-a-zoned-datetime", "2024-03-17T17:00:00[UTC]"),
    ).toThrow();
  });
});
