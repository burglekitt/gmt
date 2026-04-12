import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { endOfQuarterForUnix } from "./endOfQuarterForUnix";

describe("endOfQuarterForUnix", () => {
  let timezoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    timezoneSpy = vi
      .spyOn(getSystemTimezoneModule, "getSystemTimezone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timezoneSpy.mockRestore();
  });

  it.each`
    value         | expected
    ${1704067200} | ${"1711929599"}
    ${1706659200} | ${"1711929599"}
    ${1709251200} | ${"1711929599"}
  `("returns $expected for value $value", ({ value, expected }) => {
    const result = endOfQuarterForUnix(value as never, {
      epochUnit: "seconds",
    });
    expect(result).toBe(expected);
  });

  it.each`
    invalidValue
    ${"invalid"}
    ${-1}
    ${1.5}
    ${null}
    ${undefined}
  `(
    "returns empty string for invalid value $invalidValue",
    ({ invalidValue }) => {
      expect(endOfQuarterForUnix(invalidValue as never)).toBe("");
    },
  );
});
