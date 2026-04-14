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
    timeZone
    ${"UTC"}
    ${"Pacific/Apia"}
    ${"Pacific/Niue"}
  `("returns current year for timeZone $timeZone", ({ timeZone }) => {
    expect(getZonedYear(timeZone)).toBe("2024");
  });

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedYear("invalid")).toBe("");
  });
});
