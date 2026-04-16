import { Temporal } from "@js-temporal/polyfill";
import { parseWeekFromUtc } from "./parseWeekFromUtc";

describe("parseWeekFromUtc", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it.each`
    value                     | expected
    ${"2024-03-17T14:30:45Z"} | ${11}
    ${"2024-01-01T00:00:00Z"} | ${1}
    ${"2024-01-07T00:00:00Z"} | ${1}
    ${"2024-01-08T00:00:00Z"} | ${2}
    ${"2024-12-31T23:59:59Z"} | ${1}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseWeekFromUtc(value)).toBe(expected);
  });

  it.each`
    value            | weekStartsOn | expected
    ${"2024-01-01Z"} | ${"monday"}  | ${1}
    ${"2024-01-01Z"} | ${"sunday"}  | ${1}
  `(
    "returns $expected for $value with weekStartsOn $weekStartsOn",
    ({ value, weekStartsOn, expected }) => {
      expect(
        parseWeekFromUtc(value, { weekStartsOn: weekStartsOn as never }),
      ).toBe(expected);
    },
  );

  it.each`
    value
    ${"invalid"}
    ${""}
  `("returns null for invalid value $value", ({ value }) => {
    expect(parseWeekFromUtc(value)).toBeNull();
  });

  it("returns null on failure", () => {
    vi.spyOn(Temporal.Instant, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    vi.spyOn(Temporal.PlainDate, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseWeekFromUtc("2024-03-17T14:30:45Z");
    expect(result).toBeNull();
  });
});
