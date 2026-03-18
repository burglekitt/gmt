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
    // To simulate an error, we can temporarily override Intl.DateTimeFormat
    const originalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = class {
      constructor() {
        throw new Error("Simulated error");
      }
    } as never;

    const timezone = getSystemTimezone();
    expect(timezone).toBe("");

    // Restore the original DateTimeFormat
    Intl.DateTimeFormat = originalDateTimeFormat;
  });
});
