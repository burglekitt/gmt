import { Temporal } from "@js-temporal/polyfill";
import { parseMicrosecondFrom } from "./parseMicrosecondFromTime";

describe("parseMicrosecondFromTime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value                | expected
    ${"14:30:45"}        | ${"000"}
    ${"14:30:45.123"}    | ${"000"}
    ${"14:30:45.123456"} | ${"456"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseMicrosecondFrom(value)).toBe(expected);
  });

  it.each`
    invalidValue
    ${"invalid"}
    ${"25:00:00"}
  `(
    "returns empty string for invalid time $invalidValue",
    ({ invalidValue }) => {
      expect(parseMicrosecondFrom(invalidValue)).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseMicrosecondFrom("2024-02-29T00:00:00");
    expect(result).toBe("");
  });
});
