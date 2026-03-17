import { formatZonedDateTime } from "./formatZonedDateTime";

describe("formatZonedDateTime", () => {
  it("formats a zoned datetime using locale options", () => {
    const result = formatZonedDateTime(
      "2024-03-17T14:30:45[America/New_York]",
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    );
    expect(result).toContain("2024");
    expect(result).toMatch(/march/i);
    expect(result).toContain("14");
    expect(result).toContain("30");
  });

  it("throws for an invalid zoned datetime string", () => {
    expect(() => formatZonedDateTime("not-a-zoned-datetime")).toThrow();
  });
});
