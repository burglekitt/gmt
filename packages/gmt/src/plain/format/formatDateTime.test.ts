import { formatDateTime } from "./formatDateTime";

describe("formatDateTime", () => {
  it("formats a datetime using locale options", () => {
    const result = formatDateTime("2024-03-17T14:30:45", "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    expect(result).toContain("2024");
    expect(result).toMatch(/march/i);
    expect(result).toContain("14");
    expect(result).toContain("30");
  });

  it("throws for an invalid datetime string", () => {
    expect(() => formatDateTime("not-a-datetime")).toThrow();
  });
});
