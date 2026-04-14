import { getZonedMonth } from "./getZonedMonth";

describe("getZonedMonth", () => {
  const systemTime = "2024-02-29T23:59:59.999Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    timeZone          | expected
    ${"UTC"}          | ${"02"}
    ${"Pacific/Apia"} | ${"03"}
    ${"Pacific/Niue"} | ${"02"}
  `(
    "returns current month for timeZone $timeZone",
    ({ timeZone, expected }) => {
      expect(getZonedMonth(timeZone)).toBe(expected);
    },
  );

  it("returns empty string for invalid timeZone", () => {
    expect(getZonedMonth("invalid")).toBe("");
  });
});
