import * as getSystemTimezoneModule from "../../plain/get/getSystemTimezone";
import { MustTestDstTimezones } from "../../test/timeZoneMatrix";
import { battleTestLeapYearUnix } from "../../zoned/test/timeZoneFixtures";

import { parseUnixTime } from "./parseUnixTime";

describe("parseUnixTime", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";
  let timeZoneSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);

    timeZoneSpy = vi
      .spyOn(getSystemTimezoneModule, "getSystemTimezone")
      .mockReturnValue("UTC");
  });

  afterEach(() => {
    timeZoneSpy.mockRestore();
    vi.useRealTimers();
  });
  it.each`
    value            | options                          | expected
    ${1710685800000} | ${undefined}                     | ${"14:30:00"}
    ${1710685800000} | ${{ epochUnit: "milliseconds" }} | ${"14:30:00"}
    ${1710685800}    | ${{ epochUnit: "seconds" }}      | ${"14:30:00"}
    ${0}             | ${{ epochUnit: "seconds" }}      | ${"00:00:00"}
    ${1704067200000} | ${undefined}                     | ${"00:00:00"}
    ${1710693000000} | ${undefined}                     | ${"16:30:00"}
  `(
    "returns $expected for $value and options $options",
    ({ value, options, expected }) => {
      expect(parseUnixTime(value, options)).toBe(expected);
    },
  );

  it.each`
    value                     | timeZone                                       | expected
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones.UTC}                    | ${"00:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones.GMT}                    | ${"00:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Etc/GMT"]}             | ${"00:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Europe/Lisbon"]}       | ${"00:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Europe/Dublin"]}       | ${"00:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Europe/Berlin"]}       | ${"01:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Australia/Lord_Howe"]} | ${"11:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Pacific/Apia"]}        | ${"13:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["Pacific/Niue"]}        | ${"13:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["America/New_York"]}    | ${"19:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["America/Chicago"]}     | ${"18:00:00"}
    ${battleTestLeapYearUnix} | ${MustTestDstTimezones["America/Phoenix"]}     | ${"17:00:00"}
  `(
    "returns $expected for $value with timeZone $timeZone",
    ({ value, timeZone, expected }) => {
      expect(parseUnixTime(value, { timeZone })).toBe(expected);
    },
  );

  it.each`
    invalidValue
    ${null}
    ${undefined}
    ${NaN}
    ${Infinity}
    ${-Infinity}
  `(
    "returns empty string for invalid value $invalidValue",
    ({ invalidValue }) => {
      expect(parseUnixTime(invalidValue as unknown as number)).toBe("");
    },
  );
});
