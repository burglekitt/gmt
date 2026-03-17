import { parseZonedTime } from "./parseZonedTime";

describe("parseZonedTime", () => {
  it("returns the normalized plain time portion", () => {
    expect(parseZonedTime("2024-03-17T14:30[America/New_York]")).toBe(
      "14:30:00",
    );
  });

  it("preserves fractional seconds when present", () => {
    expect(
      parseZonedTime("2024-03-17T14:30:45.123-04:00[America/New_York]"),
    ).toBe("14:30:45.123");
  });
});
