import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { subtractUnix } from "./subtractUnix";

describe("subtractUnix", () => {
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
    value              | units            | options                          | expected
    ${"1709251200000"} | ${{ days: 1 }}   | ${undefined}                     | ${"1709164800000"}
    ${1709251200000}   | ${{ days: 1 }}   | ${undefined}                     | ${"1709164800000"}
    ${1709251200000}   | ${{ days: 1 }}   | ${{ epochUnit: "milliseconds" }} | ${"1709164800000"}
    ${1709251200}      | ${{ days: 1 }}   | ${{ epochUnit: "seconds" }}      | ${"1709164800"}
    ${86400}           | ${{ days: 1 }}   | ${{ epochUnit: "seconds" }}      | ${"0"}
    ${"1711670400000"} | ${{ months: 1 }} | ${undefined}                     | ${"1709164800000"}
    ${"1740700800000"} | ${{ years: 1 }}  | ${undefined}                     | ${"1709078400000"}
  `(
    "returns $expected for $value with $units",
    ({ value, units, options, expected }) => {
      expect(subtractUnix(value, units, options)).toBe(expected);
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
    expect(subtractUnix(value as never, units as never, options)).toBe("");
  });
});
