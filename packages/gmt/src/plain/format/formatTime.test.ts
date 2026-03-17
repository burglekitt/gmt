import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("formats a time using locale options", () => {
    const result = formatTime("14:30:45", "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    expect(result).toContain("14");
    expect(result).toContain("30");
    expect(result).toContain("45");
  });

  it("throws for an invalid time string", () => {
    expect(() => formatTime("not-a-time")).toThrow();
  });
});
