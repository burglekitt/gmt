import { Temporal } from "@js-temporal/polyfill";
import { getZonedMicrosecond } from "./getZonedMicrosecond";

describe("getZonedMicrosecond", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current microsecond", () => {
    const result = getZonedMicrosecond("UTC");
    expect(result).toMatch(/^\d{3}$/);
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedMicrosecond("invalid")).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getZonedMicrosecond("America/New_York");
    expect(result).toBe("");
  });
});
