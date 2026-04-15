import { Temporal } from "@js-temporal/polyfill";
import { getUtcMinute } from "./getUtcMinute";

describe("getUtcMinute", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123Z");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current minute", () => {
    expect(getUtcMinute()).toBe("30");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "instant").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getUtcMinute();
    expect(result).toBe("");
  });
});
