import { TomorrowTimeZone, YesterdayTimeZone } from "../../test";
import { getZonedYear } from "./getZonedYear";

describe("getZonedYear", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    timeZone             | expected
    ${"UTC"}             | ${"2024"}
    ${YesterdayTimeZone} | ${"2024"}
    ${TomorrowTimeZone}  | ${"2024"}
  `("returns current year for timeZone $timeZone", ({ timeZone, expected }) => {
    expect(getZonedYear(timeZone)).toBe(expected);
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedYear("invalid")).toBe("");
  });
});
