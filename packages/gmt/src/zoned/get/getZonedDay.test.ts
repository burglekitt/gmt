import { getZonedDay } from "./getZonedDay";

describe("getZonedDay", () => {
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
    ${"UTC"}          | ${"29"}
    ${"Pacific/Apia"} | ${"29"}
    ${"Pacific/Niue"} | ${"28"}
  `("returns $expected for timeZone $timeZone", ({ timeZone, expected }) => {
    expect(getZonedDay(timeZone)).toBe(expected);
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedDay("invalid")).toBe("");
  });
});
