import { Temporal } from "@js-temporal/polyfill";
import { parseDayOfWeekFromDate } from "./parseDayOfWeekFromDate";

describe("parseDayOfWeekFromDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value           | expected
    ${"2024-01-01"} | ${1}
    ${"2024-01-07"} | ${7}
    ${"2024-01-08"} | ${1}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseDayOfWeekFromDate(value)).toBe(expected);
  });

  it.each`
    invalidDate
    ${"invalid"}
    ${"2024-02-30"}
  `("returns null for invalid date $invalidDate", ({ invalidDate }) => {
    expect(parseDayOfWeekFromDate(invalidDate)).toBeNull();
  });

  it("returns null on failure", () => {
    vi.spyOn(Temporal.PlainDate, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseDayOfWeekFromDate("2024-02-29");
    expect(result).toBeNull();
  });
});
