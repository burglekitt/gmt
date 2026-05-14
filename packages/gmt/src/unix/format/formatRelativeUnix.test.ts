import { Temporal } from "@js-temporal/polyfill";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { MustTestLocales } from "../../test";
import { formatRelativeUnix } from "./formatRelativeUnix";

describe("formatRelativeUnix", () => {
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

  it.each`
    unix             | reference
    ${1714531200000} | ${1714617600000}
    ${1714600000000} | ${1714686400000}
  `(
    "returns a relative string for unix $unix with reference $reference",
    ({ unix, reference }) => {
      const out = formatRelativeUnix(unix, MustTestLocales.enUS, {
        epochUnit: "milliseconds",
        reference,
      });
      expect(out).toBeTruthy();
      expect(out).not.toEqual("");
    },
  );

  describe("en-US specific cases", () => {
    it.each`
      unix             | reference        | opts                     | expected
      ${1714531200000} | ${1714617600000} | ${undefined}             | ${"yesterday"}
      ${1714531200000} | ${1714617600000} | ${{ numeric: "always" }} | ${"1 day ago"}
      ${1714574400000} | ${1714578000000} | ${undefined}             | ${"hour"}
      ${1714574400000} | ${1714578000000} | ${{ numeric: "always" }} | ${"1 hour ago"}
      ${1714617600000} | ${1714531200000} | ${undefined}             | ${"tomorrow"}
      ${1714617600000} | ${1714531200000} | ${{ numeric: "always" }} | ${"in 1 day"}
      ${1714578000000} | ${1714574400000} | ${undefined}             | ${"hour"}
      ${1714578000000} | ${1714574400000} | ${{ numeric: "always" }} | ${"in 1 hour"}
    `(
      "formats en-US unix $unix with options $opts to contain $expected",
      ({ unix, reference, opts, expected }) => {
        const out = formatRelativeUnix(unix, MustTestLocales.enUS, {
          epochUnit: "milliseconds",
          reference,
          ...(opts || {}),
        });
        expect(out).toBeTruthy();
        expect(out).toContain(expected);
      },
    );
  });

  describe("epochUnit seconds handling", () => {
    it.each`
      unixSec       | referenceSec  | opts                     | expected
      ${1714531200} | ${1714617600} | ${undefined}             | ${"yesterday"}
      ${1714531200} | ${1714617600} | ${{ numeric: "always" }} | ${"1 day ago"}
      ${1714617600} | ${1714531200} | ${undefined}             | ${"tomorrow"}
      ${1714617600} | ${1714531200} | ${{ numeric: "always" }} | ${"in 1 day"}
    `(
      "formats seconds unix $unixSec with options $opts to contain $expected",
      ({ unixSec, referenceSec, opts, expected }) => {
        const out = formatRelativeUnix(unixSec, MustTestLocales.enUS, {
          epochUnit: "seconds",
          reference: referenceSec,
          ...(opts || {}),
        });
        expect(out).toBeTruthy();
        expect(out).toContain(expected);
      },
    );
  });

  describe("largestUnit plural -> singular mapping", () => {
    it.each`
      unitPlural        | valueMs                                                                | referenceMs
      ${"years"}        | ${Temporal.Instant.from("2023-05-01T00:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T00:00:00Z").epochMilliseconds}
      ${"months"}       | ${Temporal.Instant.from("2024-04-01T00:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T00:00:00Z").epochMilliseconds}
      ${"weeks"}        | ${Temporal.Instant.from("2024-04-24T00:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T00:00:00Z").epochMilliseconds}
      ${"days"}         | ${Temporal.Instant.from("2024-04-30T00:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T00:00:00Z").epochMilliseconds}
      ${"hours"}        | ${Temporal.Instant.from("2024-05-01T12:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T13:00:00Z").epochMilliseconds}
      ${"minutes"}      | ${Temporal.Instant.from("2024-05-01T12:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T12:01:00Z").epochMilliseconds}
      ${"seconds"}      | ${Temporal.Instant.from("2024-05-01T12:00:00Z").epochMilliseconds}     | ${Temporal.Instant.from("2024-05-01T12:00:01Z").epochMilliseconds}
      ${"milliseconds"} | ${Temporal.Instant.from("2024-05-01T12:00:00.000Z").epochMilliseconds} | ${Temporal.Instant.from("2024-05-01T12:00:00.001Z").epochMilliseconds}
      ${"microseconds"} | ${Temporal.Instant.from("2024-05-01T12:00:00.000Z").epochMilliseconds} | ${Temporal.Instant.from("2024-05-01T12:00:00.001Z").epochMilliseconds}
      ${"nanoseconds"}  | ${Temporal.Instant.from("2024-05-01T12:00:00.000Z").epochMilliseconds} | ${Temporal.Instant.from("2024-05-01T12:00:00.001Z").epochMilliseconds}
    `(
      "maps largestUnit $unitPlural to singular and produces same output (unix)",
      ({ unitPlural, valueMs, referenceMs }) => {
        const mapping: Record<
          string,
          "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
        > = {
          years: "year",
          months: "month",
          weeks: "week",
          days: "day",
          hours: "hour",
          minutes: "minute",
          seconds: "second",
          milliseconds: "second",
          microseconds: "second",
          nanoseconds: "second",
        };

        // Coerce a plural unit into the options type at call site without using `any`.
        const optsPlural = {
          reference: referenceMs,
          epochUnit: "milliseconds",
          largestUnit: unitPlural,
        } as unknown as Parameters<typeof formatRelativeUnix>[2];

        const optsSingular = {
          reference: referenceMs,
          epochUnit: "milliseconds",
          largestUnit: mapping[unitPlural],
        } as Parameters<typeof formatRelativeUnix>[2];

        const outPlural = formatRelativeUnix(
          valueMs,
          MustTestLocales.enUS,
          optsPlural,
        );
        const outSingular = formatRelativeUnix(
          valueMs,
          MustTestLocales.enUS,
          optsSingular,
        );

        expect(outPlural).toBe(outSingular);
      },
    );
  });

  it("uses getSystemTimeZone() when timeZone is 'local'", () => {
    const unix = 1714531200000; // 2024-05-01
    const reference = 1714617600000; // 2024-05-02

    const spy = vi
      .spyOn(getSystemTimeZoneModule, "getSystemTimeZone")
      .mockReturnValue("Europe/Paris");

    const outLocal = formatRelativeUnix(unix, MustTestLocales.enUS, {
      epochUnit: "milliseconds",
      reference,
      timeZone: "local",
    });
    const outExplicit = formatRelativeUnix(unix, MustTestLocales.enUS, {
      epochUnit: "milliseconds",
      reference,
      timeZone: "Europe/Paris",
    });

    expect(outLocal).toEqual(outExplicit);

    spy.mockRestore();
  });

  it("falls back to UTC when an invalid timezone is provided", () => {
    const unix = 1714531200000;
    const reference = 1714617600000;

    const outInvalid = formatRelativeUnix(unix, MustTestLocales.enUS, {
      epochUnit: "milliseconds",
      reference,
      timeZone: "Invalid/Zone",
    });
    const outUTC = formatRelativeUnix(unix, MustTestLocales.enUS, {
      epochUnit: "milliseconds",
      reference,
    });

    expect(outInvalid).toEqual(outUTC);
  });

  it.each`
    invalidValue
    ${"not-a-number"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns empty string for invalid unix input $invalidValue",
    ({ invalidValue }) => {
      expect(formatRelativeUnix(invalidValue as never)).toBe("");
    },
  );
});
