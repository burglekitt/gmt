import { Temporal } from "@js-temporal/polyfill";
import { parseNanosecondFromUtc } from "./parseNanosecondFromUtc";

describe("parseNanosecondFromUtc", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it.each`
    value                               | expected
    ${"2024-03-17T14:30:45Z"}           | ${"000"}
    ${"2024-03-17T14:30:45.123Z"}       | ${"000"}
    ${"2024-03-17T14:30:45.123456Z"}    | ${"000"}
    ${"2024-03-17T14:30:45.123456789Z"} | ${"789"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseNanosecondFromUtc(value)).toBe(expected);
  });

  it.each`
    value
    ${"invalid"}
    ${""}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(parseNanosecondFromUtc(value)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.Instant, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseNanosecondFromUtc("2024-03-17T14:30:45Z");
    expect(result).toBe("");
  });
});
