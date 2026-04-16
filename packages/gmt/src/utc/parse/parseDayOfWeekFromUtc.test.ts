import { Temporal } from "@js-temporal/polyfill";
import { parseDayOfWeekFromUtc } from "./parseDayOfWeekFromUtc";

describe("parseDayOfWeekFromUtc", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it.each`
    value                     | expected
    ${"2024-03-17T14:30:45Z"} | ${7}
    ${"2024-03-18T00:00:00Z"} | ${1}
    ${"2024-03-16T00:00:00Z"} | ${6}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseDayOfWeekFromUtc(value)).toBe(expected);
  });

  it.each`
    value
    ${"invalid"}
    ${""}
  `("returns null for invalid value $value", ({ value }) => {
    expect(parseDayOfWeekFromUtc(value)).toBeNull();
  });

  it("returns null on failure", () => {
    vi.spyOn(Temporal.Instant, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseDayOfWeekFromUtc("2024-03-17T14:30:45Z");
    expect(result).toBeNull();
  });
});
