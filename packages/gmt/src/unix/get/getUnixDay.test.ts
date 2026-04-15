import { Temporal } from "@js-temporal/polyfill";
import { getUnixDay } from "./getUnixDay";

describe("getUnixDay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T00:00:00.000Z");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current day", () => {
    expect(getUnixDay()).toBe("29");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "instant").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getUnixDay();
    expect(result).toBe("");
  });
});
