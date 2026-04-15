import { Temporal } from "@js-temporal/polyfill";
import { getUnixMillisecond } from "./getUnixMillisecond";

describe("getUnixMillisecond", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123Z");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current millisecond", () => {
    expect(getUnixMillisecond()).toBe("123");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "instant").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getUnixMillisecond();
    expect(result).toBe("");
  });
});
