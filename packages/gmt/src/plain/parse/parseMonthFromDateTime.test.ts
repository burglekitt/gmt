import { Temporal } from "@js-temporal/polyfill";
import { parseMonthFromDateTime } from "./parseMonthFromDateTime";

describe("parseMonthFromDateTime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each`
    value                    | expected
    ${"2024-03-15T12:30:00"} | ${"03"}
    ${"2024-12-31T23:59:59"} | ${"12"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseMonthFromDateTime(value)).toBe(expected);
  });

  it.each`
    invalidDateTime
    ${"invalid"}
    ${"2024-02-30T12:00:00"}
  `(
    "returns empty string for invalid datetime $invalidDateTime",
    ({ invalidDateTime }) => {
      expect(parseMonthFromDateTime(invalidDateTime)).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.PlainDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseMonthFromDateTime("2024-02-29T00:00:00");
    expect(result).toBe("");
  });
});
