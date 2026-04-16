import { Temporal } from "@js-temporal/polyfill";
import { parseMicrosecondFromZoned } from "./parseMicrosecondFromZoned";

describe("parseMicrosecondFromZoned", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value                               | expected
    ${"2024-03-15T14:30:45+00:00[UTC]"} | ${"000"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseMicrosecondFromZoned(value)).toBe(expected);
  });

  it.each`
    value
    ${"invalid"}
    ${""}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(parseMicrosecondFromZoned(value)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseMicrosecondFromZoned("2024-03-15T14:30:45+00:00[UTC]");
    expect(result).toBe("");
  });
});
