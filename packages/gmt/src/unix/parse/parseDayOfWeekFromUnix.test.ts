import { Temporal } from "@js-temporal/polyfill";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { battleTestLeapYearUnix } from "../../test";
import { parseDayOfWeekFromUnix } from "./parseDayOfWeekFromUnix";

describe("parseDayOfWeekFromUnix", () => {
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
    vi.restoreAllMocks();
  });

  it.each`
    value                     | expected
    ${battleTestLeapYearUnix} | ${4}
    ${1704067200000}          | ${1}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseDayOfWeekFromUnix(value)).toBe(expected);
  });

  it.each`
    value            | options           | expected
    ${1709164800}    | ${"seconds"}      | ${4}
    ${1704067200000} | ${"milliseconds"} | ${1}
  `(
    "returns $expected for $value with epochUnit $options",
    ({ value, options, expected }) => {
      expect(
        parseDayOfWeekFromUnix(value as never, { epochUnit: options as never }),
      ).toBe(expected);
    },
  );

  it.each`
    value
    ${NaN}
    ${Infinity}
    ${"invalid"}
  `("returns null for invalid value $value", ({ value }) => {
    expect(parseDayOfWeekFromUnix(value as never)).toBe(null);
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseDayOfWeekFromUnix(battleTestLeapYearUnix);
    expect(result).toBeNull();
  });
});
