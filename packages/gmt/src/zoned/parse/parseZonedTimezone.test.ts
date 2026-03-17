import { parseZonedTimezone } from "./parseZonedTimezone";

describe("parseZonedTimezone", () => {
  it("returns the bracketed IANA timezone identifier", () => {
    expect(
      parseZonedTimezone("2024-03-17T14:30:45.123-04:00[America/New_York]"),
    ).toBe("America/New_York");
  });

  it("returns UTC for UTC zoned datetime strings", () => {
    expect(parseZonedTimezone("2024-03-17T14:30:45Z[UTC]")).toBe("UTC");
  });
});
