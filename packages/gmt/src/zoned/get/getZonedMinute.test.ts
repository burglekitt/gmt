import { getZonedMinute } from "./getZonedMinute";

describe("getZonedMinute", () => {
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
  `("returns current minute for timeZone $timeZone", ({ timeZone }) => {
    const result = getZonedMinute(timeZone);
    expect(result).toMatch(/^\d{2}$/);
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedMinute("invalid")).toBe("");
  });
});
