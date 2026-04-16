import { Temporal } from "@js-temporal/polyfill";
import { parseYearFromDate } from "./parseYearFromDate";

describe("parseYearFromDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value           | expected
    ${"2024-03-15"} | ${"2024"}
    ${"0001-01-01"} | ${"1"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseYearFromDate(value)).toBe(expected);
  });

  it.each`
    invalidDate
    ${"invalid"}
    ${"2024-02-30"}
  `("returns empty string for invalid date $invalidDate", ({ invalidDate }) => {
    expect(parseYearFromDate(invalidDate)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainDate, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseYearFromDate("2024-02-29");
    expect(result).toBe("");
  });
});
