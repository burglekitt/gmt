import { mockTemporalNowInstantThrow } from "../../test/mocks";
import { getUnixSecond } from "./getUnixSecond";

describe("getUnixSecond", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime("2024-02-29T12:30:45.123Z");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns current second", () => {
    expect(getUnixSecond()).toBe("45");
  });

  it("returns empty string on failure", () => {
    // TODO CC is this even needed? the useRealTimers
    vi.useRealTimers();
    mockTemporalNowInstantThrow();
    const result = getUnixSecond();
    expect(result).toBe("");
  });
});
