import { getNanosecond } from "./getNanosecond";
import * as getSystemTimeZoneModule from "./getSystemTimeZone";

describe("getNanosecond", () => {
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
  });

  it("returns current nanosecond", () => {
    const result = getNanosecond();
    expect(result).toMatch(/^\d{3}$/);
  });

  it("returns empty string when system timeZone cannot be determined", () => {
    timeZoneSpy.mockReturnValue("");
    expect(getNanosecond()).toBe("");
  });
});
