import { Temporal } from "@js-temporal/polyfill";
import { getUnixMinute } from "./getUnixMinute";

describe("getUnixMinute", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123Z");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current minute", () => {
    expect(getUnixMinute()).toBe("30");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "instant").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getUnixMinute();
    expect(result).toBe("");
  });
});
