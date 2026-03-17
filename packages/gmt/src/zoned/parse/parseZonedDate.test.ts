import { parseZonedDate } from "./parseZonedDate";

describe("parseZonedDate", () => {
  it("returns the plain date portion", () => {
    expect(
      parseZonedDate("2024-03-17T14:30:45.123-04:00[America/New_York]"),
    ).toBe("2024-03-17");
  });

  it("throws for invalid zoned datetime strings", () => {
    expect(() => parseZonedDate("2024-03-17T14:30:45.123-04:00")).toThrow();
  });
});
