import { Temporal } from "@js-temporal/polyfill";
import { getZonedNanosecond } from "./getZonedNanosecond";

describe("getZonedNanosecond", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current nanosecond", () => {
    const result = getZonedNanosecond("UTC");
    expect(result).toHaveLength(3);
    expect(Number(result)).not.toBeNaN();
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedNanosecond("invalid")).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getZonedNanosecond("America/New_York");
    expect(result).toBe("");
  });
});
