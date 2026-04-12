import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { startOfQuarterForUnix } from "./startOfQuarterForUnix";

describe("startOfQuarterForUnix", () => {
  let timeZoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    timeZoneSpy = vi
      .spyOn(getSystemTimezoneModule, "getSystemTimezone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timeZoneSpy.mockRestore();
  });

  it.each`
    value         | expected
    ${1704067200} | ${"1704067200"}
    ${1706659200} | ${"1704067200"}
    ${1711968000} | ${"1711929600"}
  `("returns $expected for value $value", ({ value, expected }) => {
    expect(
      startOfQuarterForUnix(value as never, { epochUnit: "seconds" }),
    ).toBe(expected);
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
      expect(startOfQuarterForUnix(invalidValue as never)).toBe("");
    },
  );
});
