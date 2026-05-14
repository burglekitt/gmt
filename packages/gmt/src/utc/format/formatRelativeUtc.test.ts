import { Temporal } from "@js-temporal/polyfill";
import type { FormatRelativeOptions } from "../../internal/formatHelpers";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { MustTestLocales } from "../../test";
import { formatRelativeUtc } from "./formatRelativeUtc";

describe("formatRelativeUtc", () => {
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

  describe("en-US specific cases", () => {
    it.each`
      value                     | reference                 | opts                     | expected
      ${"2024-05-01T00:00:00Z"} | ${"2024-05-02T00:00:00Z"} | ${undefined}             | ${"yesterday"}
      ${"2024-05-01T00:00:00Z"} | ${"2024-05-02T00:00:00Z"} | ${{ numeric: "always" }} | ${"1 day ago"}
      ${"2024-05-01T12:00:00Z"} | ${"2024-05-01T13:00:00Z"} | ${undefined}             | ${"hour"}
      ${"2024-05-01T12:00:00Z"} | ${"2024-05-01T13:00:00Z"} | ${{ numeric: "always" }} | ${"1 hour ago"}
      ${"2024-05-02T00:00:00Z"} | ${"2024-05-01T00:00:00Z"} | ${undefined}             | ${"tomorrow"}
      ${"2024-05-02T00:00:00Z"} | ${"2024-05-01T00:00:00Z"} | ${{ numeric: "always" }} | ${"in 1 day"}
      ${"2024-05-01T13:00:00Z"} | ${"2024-05-01T12:00:00Z"} | ${undefined}             | ${"hour"}
      ${"2024-05-01T13:00:00Z"} | ${"2024-05-01T12:00:00Z"} | ${{ numeric: "always" }} | ${"in 1 hour"}
    `(
      "formats en-US relative $value with options $opts to contain $expected",
      ({ value, reference, opts, expected }) => {
        const out = formatRelativeUtc(value, MustTestLocales.enUS, {
          reference,
          ...(opts || {}),
        });
        expect(out).toBeTruthy();
        expect(out).toContain(expected);
      },
    );
  });

  describe("additional locales (sanity checks)", () => {
    it.each`
      locale     | value                     | reference
      ${"en-GB"} | ${"2024-05-01T00:00:00Z"} | ${"2024-05-02T00:00:00Z"}
      ${"de-DE"} | ${"2024-05-01T12:00:00Z"} | ${"2024-05-01T13:00:00Z"}
      ${"fr-FR"} | ${"2024-06-10T09:00:00Z"} | ${"2024-06-11T09:00:00Z"}
    `(
      "returns non-empty relative string for $locale",
      ({ locale, value, reference }) => {
        const out = formatRelativeUtc(value, locale, { reference });
        expect(out).toBeTruthy();
        expect(out).not.toEqual("");
      },
    );
  });

  it.each`
    value                     | reference
    ${"2024-05-01T00:00:00Z"} | ${"2024-05-02T00:00:00Z"}
    ${"2024-06-10T12:00:00Z"} | ${"2024-06-11T12:00:00Z"}
  `(
    "returns a relative string for $value with reference $reference",
    ({ value, reference }) => {
      const out = formatRelativeUtc(value, MustTestLocales.enUS, { reference });
      expect(out).toBeTruthy();
      expect(out).not.toEqual("");
    },
  );

  it("accepts numeric reference (milliseconds) and matches string reference", () => {
    const value = "2024-05-01T00:00:00Z";
    const referenceMs = Temporal.Instant.from(
      "2024-05-02T00:00:00Z",
    ).epochMilliseconds;

    const outNumber = formatRelativeUtc(value, MustTestLocales.enUS, {
      reference: referenceMs,
    });
    const outString = formatRelativeUtc(value, MustTestLocales.enUS, {
      reference: "2024-05-02T00:00:00Z",
    });

    expect(outNumber).toEqual(outString);
  });

  describe("largestUnit plural -> singular mapping", () => {
    const mapping: Record<string, string> = {
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

    it.each`
      unitPlural        | value                               | reference
      ${"years"}        | ${"2023-05-01T00:00:00Z"}           | ${"2024-05-01T00:00:00Z"}
      ${"months"}       | ${"2024-04-01T00:00:00Z"}           | ${"2024-05-01T00:00:00Z"}
      ${"weeks"}        | ${"2024-04-24T00:00:00Z"}           | ${"2024-05-01T00:00:00Z"}
      ${"days"}         | ${"2024-04-30T00:00:00Z"}           | ${"2024-05-01T00:00:00Z"}
      ${"hours"}        | ${"2024-05-01T12:00:00Z"}           | ${"2024-05-01T13:00:00Z"}
      ${"minutes"}      | ${"2024-05-01T12:00:00Z"}           | ${"2024-05-01T12:01:00Z"}
      ${"seconds"}      | ${"2024-05-01T12:00:00Z"}           | ${"2024-05-01T12:00:01Z"}
      ${"milliseconds"} | ${"2024-05-01T12:00:00.000Z"}       | ${"2024-05-01T12:00:00.001Z"}
      ${"microseconds"} | ${"2024-05-01T12:00:00.000001Z"}    | ${"2024-05-01T12:00:00.000002Z"}
      ${"nanoseconds"}  | ${"2024-05-01T12:00:00.000000001Z"} | ${"2024-05-01T12:00:00.000000002Z"}
    `(
      "maps largestUnit %s to singular and produces same output",
      ({ unitPlural, value, reference }) => {
        const outPlural = formatRelativeUtc(value, MustTestLocales.enUS, {
          reference,
          largestUnit:
            unitPlural as unknown as FormatRelativeOptions["largestUnit"],
        });

        const outSingular = formatRelativeUtc(value, MustTestLocales.enUS, {
          reference,
          largestUnit: mapping[
            unitPlural as keyof typeof mapping
          ] as unknown as FormatRelativeOptions["largestUnit"],
        });

        expect(outPlural).toBe(outSingular);
      },
    );
  });

  it("uses getSystemTimeZone() when timeZone is 'local'", () => {
    const value = "2024-02-03T14:30:45Z";
    const reference = "2024-02-03T15:30:45Z";
    timeZoneSpy.mockReturnValue("Europe/Paris");

    const outLocal = formatRelativeUtc(value, MustTestLocales.enUS, {
      reference,
      timeZone: "local",
    });
    const outExplicit = formatRelativeUtc(value, MustTestLocales.enUS, {
      reference,
      timeZone: "Europe/Paris",
    });

    expect(outLocal).toEqual(outExplicit);
  });

  it("falls back to UTC when an invalid timezone is provided", () => {
    const value = "2024-05-01T00:00:00Z";
    const reference = "2024-05-02T00:00:00Z";

    const outInvalid = formatRelativeUtc(value, MustTestLocales.enUS, {
      reference,
      timeZone: "Invalid/Zone",
    });
    const outUTC = formatRelativeUtc(value, MustTestLocales.enUS, {
      reference,
    });

    expect(outInvalid).toEqual(outUTC);
  });

  it.each`
    invalidValue
    ${"not-a-datetime"}
    ${"2024-02-29"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns an empty string for invalid datetime $invalidValue",
    ({ invalidValue }) => {
      expect(formatRelativeUtc(invalidValue as never)).toBe("");
    },
  );
});
