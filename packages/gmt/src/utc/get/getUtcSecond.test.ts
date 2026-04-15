import { Temporal } from "@js-temporal/polyfill";
import { getUtcSecond } from "./getUtcSecond";

describe("getUtcSecond", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123Z");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current second", () => {
    expect(getUtcSecond()).toBe("45");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "instant").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getUtcSecond();
    expect(result).toBe("");
  });
});
