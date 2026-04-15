import { Temporal } from "@js-temporal/polyfill";
import { TomorrowTimeZone, YesterdayTimeZone } from "../../test";
import { getZonedMinute } from "./getZonedMinute";

describe("getZonedMinute", () => {
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
    timeZone             | expected
    ${"UTC"}             | ${"00"}
    ${YesterdayTimeZone} | ${"00"}
    ${TomorrowTimeZone}  | ${"00"}
  `(
    "returns current minute for timeZone $timeZone",
    ({ timeZone, expected }) => {
      const result = getZonedMinute(timeZone);
      expect(result).toBe(expected);
    },
  );

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedMinute("invalid")).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getZonedMinute("America/New_York");
    expect(result).toBe("");
  });
});
