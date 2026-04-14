import { getZonedHour } from "./getZonedHour";

describe("getZonedHour", () => {
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
    ${"UTC"}          | ${"00"}
    ${"Pacific/Apia"} | ${"13"}
    ${"Pacific/Niue"} | ${"13"}
  `("returns $expected for timeZone $timeZone", ({ timeZone, expected }) => {
    expect(getZonedHour(timeZone)).toBe(expected);
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedHour("invalid")).toBe("");
  });
});
