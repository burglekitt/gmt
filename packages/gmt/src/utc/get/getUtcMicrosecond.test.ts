import { Temporal } from "@js-temporal/polyfill";
import { getUtcMicrosecond } from "./getUtcMicrosecond";

describe("getUtcMicrosecond", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123456Z");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current microsecond", () => {
    const result = getUtcMicrosecond();
    expect(result).toMatch(/^\d{3}$/);
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "instant").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getUtcMicrosecond();
    expect(result).toBe("");
  });
});
