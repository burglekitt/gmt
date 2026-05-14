import { MustTestLocales } from "../../test";
import { formatRelativeDate } from "./formatRelativeDate";

describe("formatRelativeDate", () => {
  const systemTime = "2024-02-29T00:00:00.000Z";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(systemTime);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each`
    value           | reference
    ${"2024-05-01"} | ${"2024-05-02"}
    ${"2024-05-01"} | ${"2024-05-01"}
  `(
    "returns a relative string for date $value with reference $reference",
    ({ value, reference }) => {
      const out = formatRelativeDate(value, MustTestLocales.enUS, {
        reference,
      });
      expect(out).toBeTruthy();
      expect(out).not.toEqual("");
    },
  );

  describe("en-US specific cases", () => {
    it.each`
      value           | reference       | opts                     | expected
      ${"2024-05-01"} | ${"2024-05-02"} | ${undefined}             | ${"yesterday"}
      ${"2024-05-01"} | ${"2024-05-02"} | ${{ numeric: "always" }} | ${"1 day ago"}
      ${"2024-05-02"} | ${"2024-05-01"} | ${undefined}             | ${"tomorrow"}
      ${"2024-05-02"} | ${"2024-05-01"} | ${{ numeric: "always" }} | ${"in 1 day"}
    `(
      "formats en-US $value with options $opts to contain $expected",
      ({ value, reference, opts, expected }) => {
        const out = formatRelativeDate(value, MustTestLocales.enUS, {
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
      unitPlural  | value           | reference
      ${"years"}  | ${"2023-05-01"} | ${"2024-05-01"}
      ${"months"} | ${"2024-04-01"} | ${"2024-05-01"}
      ${"weeks"}  | ${"2024-04-24"} | ${"2024-05-01"}
      ${"days"}   | ${"2024-04-30"} | ${"2024-05-01"}
    `(
      "maps largestUnit $unitPlural to singular and produces same output",
      ({ unitPlural, value, reference }) => {
        const mapping: Record<string, string> = {
          years: "year",
          months: "month",
          weeks: "week",
          days: "day",
        };

        const optsPlural = {
          reference,
          largestUnit: unitPlural,
        } as unknown as Parameters<typeof formatRelativeDate>[2];

        const optsSingular = {
          reference,
          largestUnit: mapping[unitPlural],
        } as Parameters<typeof formatRelativeDate>[2];

        const outPlural = formatRelativeDate(
          value,
          MustTestLocales.enUS,
          optsPlural,
        );
        const outSingular = formatRelativeDate(
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
      expect(formatRelativeDate(invalidValue as never)).toBe("");
    },
  );
});
