import { getZonedWeekOfYear } from "./getZonedWeekOfYear";

describe("getZonedWeekOfYear", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    timeZone
    ${"UTC"}
    ${"Pacific/Apia"}
    ${"Pacific/Niue"}
  `("returns current week for timeZone $timeZone", ({ timeZone }) => {
    expect(getZonedWeekOfYear(timeZone)).toBe(9);
  });

  it("returns null for invalid timeZone", () => {
    expect(getZonedWeekOfYear("invalid")).toBe(null);
  });
});
