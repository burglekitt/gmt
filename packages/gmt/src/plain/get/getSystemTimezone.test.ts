import { isValidTimezone } from "../../zoned/validate";
import { getSystemTimezone } from "./getSystemTimezone";

describe("getSystemTimezone", () => {
  it("should return a non-empty string representing the system timezone", () => {
    const timezone = getSystemTimezone();
    expect(typeof timezone).toBe("string");
    expect(timezone.length).toBeGreaterThan(0);
    expect(isValidTimezone(timezone)).toBe(true);
  });

  it("should return an empty string if an error occurs", () => {
    const resolvedOptionsSpy = vi
      .spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions")
      .mockImplementation(() => {
        throw new Error("Simulated error");
      });

    try {
      const timezone = getSystemTimezone();
      expect(timezone).toBe("");
    } finally {
      resolvedOptionsSpy.mockRestore();
    }
  });
});
