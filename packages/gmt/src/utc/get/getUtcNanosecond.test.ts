import { getUtcNanosecond } from "./getUtcNanosecond";

describe("getUtcNanosecond", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123456789Z");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns current nanosecond", () => {
    const result = getUtcNanosecond();
    expect(result).toMatch(/^\d{3}$/);
  });
});
