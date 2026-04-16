import { Temporal } from "@js-temporal/polyfill";
import { parseMinuteFromDateTime } from "./parseMinuteFromDateTime";

describe("parseMinuteFromDateTime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it.each`
    value                    | expected
    ${"2024-03-15T14:30:45"} | ${"30"}
    ${"2024-03-15T14:00:00"} | ${"00"}
    ${"2024-03-15T14:59:59"} | ${"59"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseMinuteFromDateTime(value)).toBe(expected);
  });

  it.each`
    invalidValue
    ${"invalid"}
    ${"2024-02-30T12:00:00"}
  `(
    "returns empty string for invalid datetime $invalidValue",
    ({ invalidValue }) => {
      expect(parseMinuteFromDateTime(invalidValue)).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseMinuteFromDateTime("2024-02-29T00:00:00");
    expect(result).toBe("");
  });
});
