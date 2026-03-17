import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a date using locale options", () => {
    const result = formatDate("2024-03-17", "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    expect(result).toContain("2024");
    expect(result).toMatch(/march/i);
    expect(result).toContain("17");
  });

  it("throws for an invalid date string", () => {
    expect(() => formatDate("not-a-date")).toThrow();
  });
});
