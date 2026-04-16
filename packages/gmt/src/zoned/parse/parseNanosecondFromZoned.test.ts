import { Temporal } from "@js-temporal/polyfill";
import { parseNanosecondFromZoned } from "./parseNanosecondFromZoned";

describe("parseNanosecondFromZoned", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value                                         | expected
    ${"2024-03-15T14:30:45+00:00[UTC]"}           | ${"000"}
    ${"2024-03-15T14:30:45.123+00:00[UTC]"}       | ${"000"}
    ${"2024-03-15T14:30:45.123456+00:00[UTC]"}    | ${"000"}
    ${"2024-03-15T14:30:45.123456789+00:00[UTC]"} | ${"789"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseNanosecondFromZoned(value)).toBe(expected);
  });

  it.each`
    value
    ${"invalid"}
    ${""}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(parseNanosecondFromZoned(value)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseNanosecondFromZoned("2024-03-15T14:30:45+00:00[UTC]");
    expect(result).toBe("");
  });
});
