import { Temporal } from "@js-temporal/polyfill";
import { parseYearFromUtc } from "./parseYearFromUtc";

describe("parseYearFromUtc", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value                     | expected
    ${"2024-03-17T14:30:45Z"} | ${"2024"}
    ${"2024-01-01T00:00:00Z"} | ${"2024"}
    ${"1970-01-01T00:00:00Z"} | ${"1970"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseYearFromUtc(value)).toBe(expected);
  });

  it.each`
    value
    ${"invalid"}
    ${""}
    ${"not-valid"}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(parseYearFromUtc(value)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.Instant, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseYearFromUtc("2024-03-17T14:30:45Z");
    expect(result).toBe("");
  });
});
