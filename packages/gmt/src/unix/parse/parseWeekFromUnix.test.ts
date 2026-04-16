import { Temporal } from "@js-temporal/polyfill";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { parseWeekFromUnix } from "./parseWeekFromUnix";

describe("parseWeekFromUnix", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";
  let timeZoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);

    timeZoneSpy = vi
      .spyOn(getSystemTimeZoneModule, "getSystemTimeZone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timeZoneSpy.mockRestore();
    vi.useRealTimers();
  });

  const epochMs = 1709164800000; // 2024-02-29T00:00:00.000Z

  it.each`
    value            | expected
    ${epochMs}       | ${9}
    ${1704067200000} | ${1}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseWeekFromUnix(value)).toBe(expected);
  });

  it.each`
    value      | weekStartsOn | expected
    ${epochMs} | ${"monday"}  | ${9}
    ${epochMs} | ${"sunday"}  | ${9}
  `(
    "returns $expected for $value with weekStartsOn $weekStartsOn",
    ({ value, weekStartsOn, expected }) => {
      expect(
        parseWeekFromUnix(value, { weekStartsOn: weekStartsOn as never }),
      ).toBe(expected);
    },
  );

  it.each`
    value
    ${NaN}
    ${Infinity}
    ${"invalid"}
  `("returns null for invalid value $value", ({ value }) => {
    expect(parseWeekFromUnix(value as never)).toBeNull();
  });

  it("returns null on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseWeekFromUnix(epochMs);
    expect(result).toBeNull();
  });
});
