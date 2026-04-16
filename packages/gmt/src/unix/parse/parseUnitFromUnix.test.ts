import { Temporal } from "@js-temporal/polyfill";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { battleTestLeapYearUnix } from "../../test";
import { parseUnitFromUnix } from "./parseUnitFromUnix";

describe("parseUnitFromUnix", () => {
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
    unit             | expected
    ${"year"}        | ${"2024"}
    ${"month"}       | ${"02"}
    ${"week"}        | ${"9"}
    ${"day"}         | ${"29"}
    ${"dayOfWeek"}   | ${"4"}
    ${"hour"}        | ${"00"}
    ${"minute"}      | ${"00"}
    ${"second"}      | ${"00"}
    ${"millisecond"} | ${"000"}
    ${"microsecond"} | ${"000"}
    ${"nanosecond"}  | ${"000"}
  `("returns $expected for unit $unit from ms epoch", ({ unit, expected }) => {
    const val = parseUnitFromUnix(epochMs, unit as never);
    if (unit === "microsecond" || unit === "nanosecond") {
      expect(val).toMatch(/^\d{3}$/);
    } else {
      expect(val).toBe(expected as string);
    }
  });

  it("supports seconds epoch unit", () => {
    const epochSec = 1709164800;
    expect(parseUnitFromUnix(epochSec, "year", { epochUnit: "seconds" })).toBe(
      "2024",
    );
  });

  it("supports optional timeZone", () => {
    expect(parseUnitFromUnix(epochMs, "year", { timeZone: "UTC" })).toBe(
      "2024",
    );
  });

  it.each`
    invalidValue
    ${NaN}
    ${Infinity}
  `(
    "returns empty string for invalid epoch $invalidValue",
    ({ invalidValue }) => {
      expect(parseUnitFromUnix(invalidValue as never, "year")).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    vi.spyOn(Temporal.ZonedDateTime, "from").mockImplementation(() => {
      throw new Error("simulated failure");
    });
    const result = parseUnitFromUnix(battleTestLeapYearUnix, "year");
    expect(result).toBe("");
  });
});
