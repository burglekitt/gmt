import { Temporal } from "@js-temporal/polyfill";
import { parseSecondFromDateTime } from "./parseSecondFromDateTime";

describe("parseSecondFromDateTime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it.each`
    value                    | expected
    ${"2024-03-15T14:30:45"} | ${"45"}
    ${"2024-03-15T14:30:00"} | ${"00"}
    ${"2024-03-15T14:30:59"} | ${"59"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseSecondFromDateTime(value)).toBe(expected);
  });

  it.each`
    invalidValue
    ${"invalid"}
    ${"2024-02-30T12:00:00"}
  `(
    "returns empty string for invalid datetime $invalidValue",
    ({ invalidValue }) => {
      expect(parseSecondFromDateTime(invalidValue)).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseSecondFromDateTime("2024-02-29T00:00:00");
    expect(result).toBe("");
  });
});
