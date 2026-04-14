import { getZonedDayOfWeek } from "./getZonedDayOfWeek";

describe("getZonedDayOfWeek", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    timeZone          | expected
    ${"UTC"}          | ${4}
    ${"Pacific/Apia"} | ${4}
    ${"Pacific/Niue"} | ${3}
  `("returns $expected for timeZone $timeZone", ({ timeZone, expected }) => {
    expect(getZonedDayOfWeek(timeZone)).toBe(expected);
  });

  it("returns null for invalid timeZone", () => {
    expect(getZonedDayOfWeek("invalid")).toBe(null);
  });
});
