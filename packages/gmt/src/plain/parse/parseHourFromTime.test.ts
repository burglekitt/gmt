import { Temporal } from "@js-temporal/polyfill";
import { parseHourFromTime } from "./parseHourFromTime";

describe("parseHourFromTime", () => {
  it.each`
    value         | expected
    ${"12:30:00"} | ${"12"}
    ${"00:00:00"} | ${"00"}
    ${"23:59:59"} | ${"23"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseHourFromTime(value)).toBe(expected);
  });

  it.each`
    invalidTime
    ${"invalid"}
    ${"25:00:00"}
  `("returns empty string for invalid time $invalidTime", ({ invalidTime }) => {
    expect(parseHourFromTime(invalidTime)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseHourFromTime("12:30:00");
    expect(result).toBe("");
  });
});
