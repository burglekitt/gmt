import { Temporal } from "@js-temporal/polyfill";
import type { FormatRelativeOptions } from "../../internal/formatHelpers";
import * as getSystemTimeZoneModule from "../../plain/get/getSystemTimeZone";
import { MustTestLocales } from "../../test";
import { formatRelativeZoned } from "./formatRelativeZoned";

describe("formatRelativeZoned", () => {
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
      value                               | reference                           | opts                     | expected
      ${"2024-05-01T00:00:00+00:00[UTC]"} | ${"2024-05-02T00:00:00+00:00[UTC]"} | ${undefined}             | ${"yesterday"}
      ${"2024-05-01T00:00:00+00:00[UTC]"} | ${"2024-05-02T00:00:00+00:00[UTC]"} | ${{ numeric: "always" }} | ${"1 day ago"}
      ${"2024-05-01T12:00:00+00:00[UTC]"} | ${"2024-05-01T13:00:00+00:00[UTC]"} | ${undefined}             | ${"hour"}
      ${"2024-05-01T12:00:00+00:00[UTC]"} | ${"2024-05-01T13:00:00+00:00[UTC]"} | ${{ numeric: "always" }} | ${"1 hour ago"}
      ${"2024-05-02T00:00:00+00:00[UTC]"} | ${"2024-05-01T00:00:00+00:00[UTC]"} | ${undefined}             | ${"tomorrow"}
      ${"2024-05-02T00:00:00+00:00[UTC]"} | ${"2024-05-01T00:00:00+00:00[UTC]"} | ${{ numeric: "always" }} | ${"in 1 day"}
      ${"2024-05-01T13:00:00+00:00[UTC]"} | ${"2024-05-01T12:00:00+00:00[UTC]"} | ${undefined}             | ${"hour"}
      ${"2024-05-01T13:00:00+00:00[UTC]"} | ${"2024-05-01T12:00:00+00:00[UTC]"} | ${{ numeric: "always" }} | ${"in 1 hour"}
    `(
      "formats en-US relative $value with options $opts to contain $expected",
      ({ value, reference, opts, expected }) => {
        const out = formatRelativeZoned(value, MustTestLocales.enUS, {
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
      locale     | value                                         | reference
      ${"en-GB"} | ${"2024-05-01T00:00:00+00:00[Europe/London]"} | ${"2024-05-02T00:00:00+00:00[Europe/London]"}
      ${"de-DE"} | ${"2024-05-01T12:00:00+01:00[Europe/Berlin]"} | ${"2024-05-01T13:00:00+01:00[Europe/Berlin]"}
      ${"fr-FR"} | ${"2024-06-10T09:00:00+01:00[Europe/Paris]"}  | ${"2024-06-11T09:00:00+01:00[Europe/Paris]"}
    `(
      "returns non-empty relative string for $locale",
      ({ locale, value, reference }) => {
        const out = formatRelativeZoned(value, locale, { reference });
        expect(out).toBeTruthy();
        expect(out).not.toEqual("");
      },
    );
  });

  it.each`
    value                               | reference
    ${"2024-05-01T00:00:00+00:00[UTC]"} | ${"2024-05-02T00:00:00+00:00[UTC]"}
    ${"2024-06-10T12:00:00+00:00[UTC]"} | ${"2024-06-11T12:00:00+00:00[UTC]"}
  `(
    "returns a relative string for $value with reference $reference",
    ({ value, reference }) => {
      const out = formatRelativeZoned(value, MustTestLocales.enUS, {
        reference,
      });
      expect(out).toBeTruthy();
      expect(out).not.toEqual("");
    },
  );

  it("accepts numeric reference (milliseconds) and matches string reference", () => {
    const value = "2024-05-01T00:00:00+00:00[UTC]";
    const referenceMs = Temporal.Instant.from(
      "2024-05-02T00:00:00Z",
    ).epochMilliseconds;

    const outNumber = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference: referenceMs,
    });
    const outString = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference: "2024-05-02T00:00:00+00:00[UTC]",
    });

    expect(outNumber).toEqual(outString);
  });

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
    unitPlural        | value                                         | reference
    ${"years"}        | ${"2023-05-01T00:00:00+00:00[UTC]"}           | ${"2024-05-01T00:00:00+00:00[UTC]"}
    ${"months"}       | ${"2024-04-01T00:00:00+00:00[UTC]"}           | ${"2024-05-01T00:00:00+00:00[UTC]"}
    ${"weeks"}        | ${"2024-04-24T00:00:00+00:00[UTC]"}           | ${"2024-05-01T00:00:00+00:00[UTC]"}
    ${"days"}         | ${"2024-04-30T00:00:00+00:00[UTC]"}           | ${"2024-05-01T00:00:00+00:00[UTC]"}
    ${"hours"}        | ${"2024-05-01T12:00:00+00:00[UTC]"}           | ${"2024-05-01T13:00:00+00:00[UTC]"}
    ${"minutes"}      | ${"2024-05-01T12:00:00+00:00[UTC]"}           | ${"2024-05-01T12:01:00+00:00[UTC]"}
    ${"seconds"}      | ${"2024-05-01T12:00:00+00:00[UTC]"}           | ${"2024-05-01T12:00:01+00:00[UTC]"}
    ${"milliseconds"} | ${"2024-05-01T12:00:00.000+00:00[UTC]"}       | ${"2024-05-01T12:00:00.001+00:00[UTC]"}
    ${"microseconds"} | ${"2024-05-01T12:00:00.000001+00:00[UTC]"}    | ${"2024-05-01T12:00:00.000002+00:00[UTC]"}
    ${"nanoseconds"}  | ${"2024-05-01T12:00:00.000000001+00:00[UTC]"} | ${"2024-05-01T12:00:00.000000002+00:00[UTC]"}
  `(
    "maps largestUnit %s to singular and produces same output",
    ({ unitPlural, value, reference }) => {
      const outPlural = formatRelativeZoned(value, MustTestLocales.enUS, {
        reference,
        largestUnit:
          unitPlural as unknown as FormatRelativeOptions["largestUnit"],
      } as unknown as Record<string, unknown>);

      const outSingular = formatRelativeZoned(value, MustTestLocales.enUS, {
        reference,
        largestUnit: mapping[
          unitPlural as keyof typeof mapping
        ] as unknown as FormatRelativeOptions["largestUnit"],
      } as unknown as Record<string, unknown>);

      expect(outPlural).toBe(outSingular);
    },
  );

  it("uses getSystemTimeZone() when timeZone is 'local'", () => {
    const value = "2024-02-03T14:30:45+00:00[UTC]";
    const reference = "2024-02-03T15:30:45+00:00[UTC]";
    timeZoneSpy.mockReturnValue("Europe/Paris");

    const outLocal = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
      timeZone: "local",
    });
    const outExplicit = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
      timeZone: "Europe/Paris",
    });

    expect(outLocal).toEqual(outExplicit);
  });

  it("falls back to UTC when an invalid timezone is provided", () => {
    const value = "2024-05-01T00:00:00+00:00[UTC]";
    const reference = "2024-05-02T00:00:00+00:00[UTC]";

    const outInvalid = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
      timeZone: "Invalid/Zone",
    });
    const outUTC = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
    });

    expect(outInvalid).toEqual(outUTC);
  });

  it("re-zones the input value to the specified timeZone", () => {
    const value = "2024-05-01T12:00:00+00:00[UTC]";
    const reference = "2024-05-01T13:00:00+00:00[UTC]";

    const outUTC = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
    });
    const outParis = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
      timeZone: "Europe/Paris",
    });

    // Same instant, same reference, different display timezone => same relative result
    expect(outParis).toEqual(outUTC);
  });

  it.each`
    invalidValue
    ${"not-a-datetime"}
    ${"2024-02-29"}
    ${""}
    ${null}
    ${undefined}
    ${true}
    ${"2024-05-01T12:00:00Z"}
    ${"2024-05-01T12:00:00"}
  `(
    "returns an empty string for invalid zoned datetime $invalidValue",
    ({ invalidValue }) => {
      expect(formatRelativeZoned(invalidValue as never)).toBe("");
    },
  );

  it("works with zoned datetimes in various explicit timezones", () => {
    const value = "2024-05-01T12:00:00+09:00[Asia/Tokyo]";
    const reference = "2024-05-01T13:00:00+09:00[Asia/Tokyo]";

    const out = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
    });

    expect(out).toBeTruthy();
    expect(out).toContain("hour");
  });

  it("handles offset-only zoned datetime strings", () => {
    const value = "2024-05-01T12:00:00-05:00[America/New_York]";
    const reference = "2024-05-01T13:00:00-05:00[America/New_York]";

    const out = formatRelativeZoned(value, MustTestLocales.enUS, {
      reference,
    });

    expect(out).toBeTruthy();
    expect(out).toContain("hour");
  });
});
