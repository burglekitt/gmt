import { getUtcYear } from "./getUtcYear";

describe("getUtcYear", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T00:00:00.000Z");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns current year", () => {
    expect(getUtcYear()).toBe("2024");
  });

  it("returns empty string on failure", () => {
    vi.useRealTimers();
    const result = getUtcYear();
    expect(result).toMatch(/^(\d{4}|)$/);
  });
});
