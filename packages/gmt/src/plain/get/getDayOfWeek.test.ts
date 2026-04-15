import { Temporal } from "@js-temporal/polyfill";
import { TomorrowTimeZone, YesterdayTimeZone } from "../../test";
import { getDayOfWeek } from "./getDayOfWeek";
import * as getSystemTimeZoneModule from "./getSystemTimeZone";

describe("getDayOfWeek", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";
  let timeZoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);

    timeZoneSpy = vi
      .spyOn(getSystemTimeZoneModule, "getSystemTimeZone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timeZoneSpy.mockRestore();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns current day of week", () => {
    expect(getDayOfWeek()).toBe(4);
  });

  it("returns null when system timeZone cannot be determined", () => {
    timeZoneSpy.mockReturnValue("");
    expect(getDayOfWeek()).toBe(null);
  });

  it.each`
    timeZone             | expected
    ${"UTC"}             | ${4}
    ${YesterdayTimeZone} | ${3}
    ${TomorrowTimeZone}  | ${4}
  `(
    "yesterday / today tests: returns $expected for system timeZone $timeZone",
    ({ timeZone, expected }) => {
      timeZoneSpy.mockReturnValue(timeZone);
      expect(getDayOfWeek()).toBe(expected);
    },
  );

  it("returns null on failure", () => {
    vi.useRealTimers();
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = getDayOfWeek();
    expect(result).toBe(null);
  });
});
