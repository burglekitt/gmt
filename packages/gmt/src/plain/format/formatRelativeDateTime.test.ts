import { MustTestLocales } from "../../test";
import { formatRelativeDateTime } from "./formatRelativeDateTime";

describe("formatRelativeDateTime", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    value                    | reference
    ${"2024-05-01T00:00:00"} | ${"2024-05-02T00:00:00"}
    ${"2024-05-01T12:00:00"} | ${"2024-05-01T13:00:00"}
  `(
    "returns a relative string for $value with reference $reference",
    ({ value, reference }) => {
      const out = formatRelativeDateTime(value, MustTestLocales.enUS, {
        reference,
      });
      expect(out).toBeTruthy();
      expect(out).not.toEqual("");
    },
  );

  describe("en-US specific cases", () => {
    it.each`
      value                    | reference                | opts                     | expected
      ${"2024-05-01T00:00:00"} | ${"2024-05-02T00:00:00"} | ${undefined}             | ${"yesterday"}
      ${"2024-05-01T00:00:00"} | ${"2024-05-02T00:00:00"} | ${{ numeric: "always" }} | ${"1 day ago"}
      ${"2024-05-01T12:00:00"} | ${"2024-05-01T13:00:00"} | ${undefined}             | ${"hour"}
      ${"2024-05-01T12:00:00"} | ${"2024-05-01T13:00:00"} | ${{ numeric: "always" }} | ${"1 hour ago"}
      ${"2024-05-02T00:00:00"} | ${"2024-05-01T00:00:00"} | ${undefined}             | ${"tomorrow"}
      ${"2024-05-02T00:00:00"} | ${"2024-05-01T00:00:00"} | ${{ numeric: "always" }} | ${"in 1 day"}
      ${"2024-05-01T13:00:00"} | ${"2024-05-01T12:00:00"} | ${undefined}             | ${"hour"}
      ${"2024-05-01T13:00:00"} | ${"2024-05-01T12:00:00"} | ${{ numeric: "always" }} | ${"in 1 hour"}
    `(
      "formats en-US $value with options $opts to contain $expected",
      ({ value, reference, opts, expected }) => {
        const out = formatRelativeDateTime(value, MustTestLocales.enUS, {
          reference,
          ...(opts || {}),
        });
        expect(out).toBeTruthy();
        expect(out).toContain(expected);
      },
    );
  });

  describe("largestUnit plural -> singular mapping", () => {
    it.each`
      unitPlural        | value                        | reference
      ${"years"}        | ${"2023-05-01T00:00:00"}     | ${"2024-05-01T00:00:00"}
      ${"months"}       | ${"2024-04-01T00:00:00"}     | ${"2024-05-01T00:00:00"}
      ${"weeks"}        | ${"2024-04-24T00:00:00"}     | ${"2024-05-01T00:00:00"}
      ${"days"}         | ${"2024-04-30T00:00:00"}     | ${"2024-05-01T00:00:00"}
      ${"hours"}        | ${"2024-05-01T12:00:00"}     | ${"2024-05-01T13:00:00"}
      ${"minutes"}      | ${"2024-05-01T12:00:00"}     | ${"2024-05-01T12:01:00"}
      ${"seconds"}      | ${"2024-05-01T12:00:00"}     | ${"2024-05-01T12:00:01"}
      ${"milliseconds"} | ${"2024-05-01T12:00:00.000"} | ${"2024-05-01T12:00:00.001"}
      ${"microseconds"} | ${"2024-05-01T12:00:00.000"} | ${"2024-05-01T12:00:00.001"}
      ${"nanoseconds"}  | ${"2024-05-01T12:00:00.000"} | ${"2024-05-01T12:00:00.001"}
    `(
      "maps largestUnit $unitPlural to singular and produces same output",
      ({ unitPlural, value, reference }) => {
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

        const optsPlural = {
          reference,
          largestUnit: unitPlural,
        } as unknown as Parameters<typeof formatRelativeDateTime>[2];

        const optsSingular = {
          reference,
          largestUnit: mapping[unitPlural],
        } as Parameters<typeof formatRelativeDateTime>[2];

        const outPlural = formatRelativeDateTime(
          value,
          MustTestLocales.enUS,
          optsPlural,
        );
        const outSingular = formatRelativeDateTime(
          value,
          MustTestLocales.enUS,
          optsSingular,
        );

        expect(outPlural).toBe(outSingular);
      },
    );
  });

  it.each`
    invalidValue
    ${"not-a-date"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns empty string for invalid input $invalidValue",
    ({ invalidValue }) => {
      expect(formatRelativeDateTime(invalidValue as never)).toBe("");
    },
  );
});
