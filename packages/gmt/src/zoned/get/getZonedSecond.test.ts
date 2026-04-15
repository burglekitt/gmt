import { Temporal } from "@js-temporal/polyfill";
import { TomorrowTimeZone, YesterdayTimeZone } from "../../test";
import { getZonedSecond } from "./getZonedSecond";

describe("getZonedSecond", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it.each`
    timeZone
    ${"UTC"}
    ${YesterdayTimeZone}
    ${TomorrowTimeZone}
  `("returns current second for timeZone $timeZone", ({ timeZone }) => {
    const result = getZonedSecond(timeZone);
    expect(result).toMatch(/^\d{2}$/);
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedSecond("invalid")).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getZonedSecond("America/New_York");
    expect(result).toBe("");
  });
});
