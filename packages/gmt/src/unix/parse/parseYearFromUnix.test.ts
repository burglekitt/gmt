import { Temporal } from "@js-temporal/polyfill";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { parseYearFromUnix } from "./parseYearFromUnix";

describe("parseYearFromUnix", () => {
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

  const epochMs = 1709164800000; // 2024-02-29T00:00:00.000Z

  it.each`
    value            | expected
    ${epochMs}       | ${"2024"}
    ${1704067200000} | ${"2024"}
    ${0}             | ${"1970"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseYearFromUnix(value)).toBe(expected);
  });

  it.each`
    value            | options           | expected
    ${1709164800}    | ${"seconds"}      | ${"2024"}
    ${1704067200000} | ${"milliseconds"} | ${"2024"}
  `(
    "returns $expected for $value with epochUnit $options",
    ({ value, options, expected }) => {
      expect(
        parseYearFromUnix(value as never, { epochUnit: options as never }),
      ).toBe(expected);
    },
  );

  it.each`
    value
    ${NaN}
    ${Infinity}
    ${"invalid"}
  `("returns empty string for invalid value $value", ({ value }) => {
    expect(parseYearFromUnix(value as never)).toBe("");
  });

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseYearFromUnix(epochMs);
    expect(result).toBe("");
  });
});
