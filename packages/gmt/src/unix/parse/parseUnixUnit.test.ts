import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { parseUnixUnit } from "./parseUnixUnit";

describe("parseUnixUnit", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";
  let timezoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);

    timezoneSpy = vi
      .spyOn(getSystemTimezoneModule, "getSystemTimezone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timezoneSpy.mockRestore();
    vi.useRealTimers();
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
    const val = parseUnixUnit(epochMs, unit as never);
    if (unit === "microsecond" || unit === "nanosecond") {
      expect(val).toMatch(/^\d{3}$/);
    } else {
      expect(val).toBe(expected as string);
    }
  });

  it("supports seconds epoch unit", () => {
    const epochSec = 1709164800;
    expect(parseUnixUnit(epochSec, "year", "seconds")).toBe("2024");
  });

  it.each`
    invalidValue
    ${NaN}
    ${Infinity}
  `(
    "returns empty string for invalid epoch $invalidValue",
    ({ invalidValue }) => {
      expect(parseUnixUnit(invalidValue as never, "year")).toBe("");
    },
  );
});
