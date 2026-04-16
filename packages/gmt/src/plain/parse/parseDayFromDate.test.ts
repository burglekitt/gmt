import { Temporal } from "@js-temporal/polyfill";
import { parseDayFromDate } from "./parseDayFromDate";

describe("parseDayFromDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value           | expected
    ${"2024-03-15"} | ${"15"}
    ${"2024-12-31"} | ${"31"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseDayFromDate(value)).toBe(expected);
  });

  it.each`
    invalidDate
    ${"invalid"}
    ${"2024-02-30"}
  `("returns empty string for invalid date $invalidDate", ({ invalidDate }) => {
    expect(parseDayFromDate(invalidDate)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainDate, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseDayFromDate("2024-02-29");
    expect(result).toBe("");
  });
});
