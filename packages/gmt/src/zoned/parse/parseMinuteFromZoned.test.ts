import { Temporal } from "@js-temporal/polyfill";
import { parseMinuteFromZoned } from "./parseMinuteFromZoned";

describe("parseMinuteFromZoned", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value                               | expected
    ${"2024-03-15T14:30:45+00:00[UTC]"} | ${"30"}
    ${"2024-03-15T14:00:00+00:00[UTC]"} | ${"00"}
    ${"2024-03-15T14:59:59+00:00[UTC]"} | ${"59"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseMinuteFromZoned(value)).toBe(expected);
  });

  it.each`
    value
    ${"invalid"}
    ${""}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(parseMinuteFromZoned(value)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseMinuteFromZoned("2024-03-15T14:30:45+00:00[UTC]");
    expect(result).toBe("");
  });
});
