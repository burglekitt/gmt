import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { addUnix } from "./addUnix";

describe("addUnix", () => {
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
    value              | units            | options                          | expected
    ${"1709164800000"} | ${{ days: 1 }}   | ${undefined}                     | ${"1709251200000"}
    ${1709164800000}   | ${{ days: 1 }}   | ${undefined}                     | ${"1709251200000"}
    ${1709164800000}   | ${{ days: 1 }}   | ${{ epochUnit: "milliseconds" }} | ${"1709251200000"}
    ${1709164800}      | ${{ days: 1 }}   | ${{ epochUnit: "seconds" }}      | ${"1709251200"}
    ${0}               | ${{ days: 1 }}   | ${{ epochUnit: "seconds" }}      | ${"86400"}
    ${"1709164800000"} | ${{ months: 1 }} | ${undefined}                     | ${"1711670400000"}
    ${"1709164800000"} | ${{ years: 1 }}  | ${undefined}                     | ${"1740700800000"}
  `(
    "returns $expected for $value with $units",
    ({ value, units, options, expected }) => {
      expect(addUnix(value, units, options)).toBe(expected);
    },
  );

  it.each`
    value              | units                 | options
    ${"invalid"}       | ${{ days: 1 }}        | ${undefined}
    ${-1}              | ${{ days: 1 }}        | ${undefined}
    ${1.5}             | ${{ days: 1 }}        | ${undefined}
    ${null}            | ${{ days: 1 }}        | ${undefined}
    ${"1709164800000"} | ${{ invalidUnit: 1 }} | ${undefined}
    ${"1709164800000"} | ${{ days: "1" }}      | ${undefined}
  `("returns empty string for invalid input", ({ value, units, options }) => {
    expect(addUnix(value as never, units as never, options)).toBe("");
  });
});
