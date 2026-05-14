import { MustTestLocales } from "../../test";
import { formatRelativeTime } from "./formatRelativeTime";

describe("formatRelativeTime", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    value         | reference
    ${"00:00:00"} | ${"2024-05-02T00:00:00"}
    ${"12:00:00"} | ${"2024-05-01T13:00:00"}
  `(
    "returns a relative string for time $value with reference $reference",
    ({ value, reference }) => {
      const out = formatRelativeTime(value, MustTestLocales.enUS, {
        reference,
      });
      expect(out).toBeTruthy();
      expect(out).not.toEqual("");
    },
  );

  describe("en-US specific cases", () => {
    it.each`
      value         | reference                | opts                     | expected
      ${"00:00:00"} | ${"2024-05-02T00:00:00"} | ${undefined}             | ${"now"}
      ${"00:00:00"} | ${"2024-05-02T00:00:00"} | ${{ numeric: "always" }} | ${"0 seconds ago"}
      ${"12:00:00"} | ${"2024-05-01T13:00:00"} | ${undefined}             | ${"hour"}
      ${"12:00:00"} | ${"2024-05-01T13:00:00"} | ${{ numeric: "always" }} | ${"1 hour ago"}
      ${"00:00:00"} | ${"2024-05-01T00:00:00"} | ${undefined}             | ${"now"}
      ${"00:00:00"} | ${"2024-05-01T00:00:00"} | ${{ numeric: "always" }} | ${"0 seconds ago"}
    `(
      "formats en-US $value with options $opts to contain $expected",
      ({ value, reference, opts, expected }) => {
        const out = formatRelativeTime(value, MustTestLocales.enUS, {
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
      unitPlural        | valueTime         | reference
      ${"hours"}        | ${"12:00:00"}     | ${"2024-05-01T13:00:00"}
      ${"minutes"}      | ${"12:00:00"}     | ${"2024-05-01T12:01:00"}
      ${"seconds"}      | ${"12:00:00"}     | ${"2024-05-01T12:00:01"}
      ${"milliseconds"} | ${"12:00:00.000"} | ${"2024-05-01T12:00:00.001"}
    `(
      "maps largestUnit $unitPlural to singular and produces same output",
      ({ unitPlural, valueTime, reference }) => {
        const mapping: Record<string, string> = {
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
        } as unknown as Parameters<typeof formatRelativeTime>[2];

        const optsSingular = {
          reference,
          largestUnit: mapping[unitPlural],
        } as Parameters<typeof formatRelativeTime>[2];

        const outPlural = formatRelativeTime(
          valueTime,
          MustTestLocales.enUS,
          optsPlural,
        );
        const outSingular = formatRelativeTime(
          valueTime,
          MustTestLocales.enUS,
          optsSingular,
        );

        expect(outPlural).toBe(outSingular);
      },
    );
  });

  it.each`
    invalidValue
    ${"not-a-time"}
    ${""}
    ${null}
    ${undefined}
    ${true}
  `(
    "returns empty string for invalid input $invalidValue",
    ({ invalidValue }) => {
      expect(formatRelativeTime(invalidValue as never)).toBe("");
    },
  );
});
