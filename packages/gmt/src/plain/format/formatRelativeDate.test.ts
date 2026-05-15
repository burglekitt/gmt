import { Temporal } from "@js-temporal/polyfill";
import { vi } from "vitest";
import { MustTestLocales } from "../../test";
import { formatRelativeDate } from "./formatRelativeDate";

const REF = "2024-03-15";

describe("formatRelativeDate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Auto unit selection
  // day (<7 days), week (7–27), month (28–364), year (365+)
  // ---------------------------------------------------------------------------
  describe("auto unit selection", () => {
    it.each`
      value           | expected
      ${"2024-03-12"} | ${"3 days ago"}
      ${"2024-03-18"} | ${"in 3 days"}
      ${"2024-03-08"} | ${"last week"}
      ${"2024-03-22"} | ${"next week"}
      ${"2024-02-16"} | ${"last month"}
      ${"2024-04-12"} | ${"next month"}
      ${"2023-03-15"} | ${"last year"}
      ${"2025-03-15"} | ${"next year"}
    `("formats $value relative to REF as $expected", ({ value, expected }) => {
      expect(
        formatRelativeDate(value, MustTestLocales.enUS, { reference: REF }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // ±1 and 0 permutations
  // ---------------------------------------------------------------------------
  describe("±1 and 0 permutations", () => {
    it.each`
      value           | expected
      ${"2024-03-15"} | ${"today"}
      ${"2024-03-14"} | ${"yesterday"}
      ${"2024-03-16"} | ${"tomorrow"}
      ${"2024-03-08"} | ${"last week"}
      ${"2024-03-22"} | ${"next week"}
      ${"2024-02-16"} | ${"last month"}
      ${"2024-04-12"} | ${"next month"}
      ${"2023-03-15"} | ${"last year"}
      ${"2025-03-15"} | ${"next year"}
    `("formats $value (en-US, auto) as $expected", ({ value, expected }) => {
      expect(
        formatRelativeDate(value, MustTestLocales.enUS, { reference: REF }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Locale coverage — 3 days past
  // ---------------------------------------------------------------------------
  describe("locale coverage — 3 days past", () => {
    const value = "2024-03-12";

    it.each`
      locale                  | expected
      ${MustTestLocales.enUS} | ${"3 days ago"}
      ${MustTestLocales.enGB} | ${"3 days ago"}
      ${MustTestLocales.deDE} | ${"vor 3 Tagen"}
      ${MustTestLocales.frFR} | ${"il y a 3 jours"}
      ${MustTestLocales.esES} | ${"hace 3 días"}
      ${MustTestLocales.itIT} | ${"3 giorni fa"}
      ${MustTestLocales.ptPT} | ${"há 3 dias"}
      ${MustTestLocales.svSE} | ${"för 3 dagar sedan"}
      ${MustTestLocales.isIS} | ${"fyrir 3 dögum"}
      ${MustTestLocales.zhCN} | ${"3天前"}
      ${MustTestLocales.zhTW} | ${"3 天前"}
      ${MustTestLocales.jaJP} | ${"3 日前"}
      ${MustTestLocales.koKR} | ${"3일 전"}
      ${MustTestLocales.arSA} | ${"قبل ٣ أيام"}
      ${MustTestLocales.heIL} | ${"לפני 3 ימים"}
      ${MustTestLocales.ruRU} | ${"3 дня назад"}
      ${MustTestLocales.trTR} | ${"3 gün önce"}
    `("formats for $locale as $expected", ({ locale, expected }) => {
      expect(formatRelativeDate(value, locale, { reference: REF })).toBe(
        expected,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Locale coverage — 3 days future
  // ---------------------------------------------------------------------------
  describe("locale coverage — 3 days future", () => {
    const value = "2024-03-18";

    it.each`
      locale                  | expected
      ${MustTestLocales.enUS} | ${"in 3 days"}
      ${MustTestLocales.enGB} | ${"in 3 days"}
      ${MustTestLocales.deDE} | ${"in 3 Tagen"}
      ${MustTestLocales.frFR} | ${"dans 3 jours"}
      ${MustTestLocales.esES} | ${"dentro de 3 días"}
      ${MustTestLocales.itIT} | ${"tra 3 giorni"}
      ${MustTestLocales.ptPT} | ${"dentro de 3 dias"}
      ${MustTestLocales.svSE} | ${"om 3 dagar"}
      ${MustTestLocales.isIS} | ${"eftir 3 daga"}
      ${MustTestLocales.zhCN} | ${"3天后"}
      ${MustTestLocales.zhTW} | ${"3 天後"}
      ${MustTestLocales.jaJP} | ${"3 日後"}
      ${MustTestLocales.koKR} | ${"3일 후"}
      ${MustTestLocales.arSA} | ${"خلال ٣ أيام"}
      ${MustTestLocales.heIL} | ${"בעוד 3 ימים"}
      ${MustTestLocales.ruRU} | ${"через 3 дня"}
      ${MustTestLocales.trTR} | ${"3 gün sonra"}
    `("formats for $locale as $expected", ({ locale, expected }) => {
      expect(formatRelativeDate(value, locale, { reference: REF })).toBe(
        expected,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // style option
  // ---------------------------------------------------------------------------
  describe("style option", () => {
    const value = "2024-03-12";

    it.each`
      style       | expected
      ${"long"}   | ${"3 days ago"}
      ${"short"}  | ${"3 days ago"}
      ${"narrow"} | ${"3d ago"}
    `("style:$style formats -3 days as $expected", ({ style, expected }) => {
      expect(
        formatRelativeDate(value, MustTestLocales.enUS, {
          reference: REF,
          style,
        }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // numeric option
  // ---------------------------------------------------------------------------
  describe("numeric option", () => {
    it.each`
      value           | numeric     | expected
      ${"2024-03-15"} | ${"auto"}   | ${"today"}
      ${"2024-03-15"} | ${"always"} | ${"in 0 days"}
      ${"2024-03-16"} | ${"auto"}   | ${"tomorrow"}
      ${"2024-03-16"} | ${"always"} | ${"in 1 day"}
      ${"2024-03-14"} | ${"auto"}   | ${"yesterday"}
      ${"2024-03-14"} | ${"always"} | ${"1 day ago"}
    `(
      "numeric:$numeric for $value → $expected",
      ({ value, numeric, expected }) => {
        expect(
          formatRelativeDate(value, MustTestLocales.enUS, {
            reference: REF,
            numeric,
          }),
        ).toBe(expected);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // explicit largestUnit
  // ---------------------------------------------------------------------------
  describe("explicit largestUnit", () => {
    it.each`
      value           | largestUnit | expected
      ${"2024-03-12"} | ${"day"}    | ${"3 days ago"}
      ${"2024-03-18"} | ${"day"}    | ${"in 3 days"}
      ${"2024-02-23"} | ${"week"}   | ${"3 weeks ago"}
      ${"2024-03-08"} | ${"week"}   | ${"last week"}
      ${"2024-03-22"} | ${"week"}   | ${"next week"}
    `(
      "largestUnit:$largestUnit for $value → $expected",
      ({ value, largestUnit, expected }) => {
        expect(
          formatRelativeDate(value, MustTestLocales.enUS, {
            reference: REF,
            largestUnit,
          }),
        ).toBe(expected);
      },
    );

    it("largestUnit:month — 2 months ago", () => {
      expect(
        formatRelativeDate("2024-01-15", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "month",
        }),
      ).toBe("2 months ago");
    });

    it("largestUnit:month — in 2 months", () => {
      expect(
        formatRelativeDate("2024-05-15", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "month",
        }),
      ).toBe("in 2 months");
    });

    it("largestUnit:year — last year", () => {
      expect(
        formatRelativeDate("2023-03-15", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "year",
        }),
      ).toBe("last year");
    });

    it("largestUnit:year — next year", () => {
      expect(
        formatRelativeDate("2025-03-15", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "year",
        }),
      ).toBe("next year");
    });

    it("largestUnit:year — 2 years ago", () => {
      expect(
        formatRelativeDate("2022-03-15", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "year",
        }),
      ).toBe("2 years ago");
    });
  });

  // ---------------------------------------------------------------------------
  // Invalid inputs — must return ""
  // ---------------------------------------------------------------------------
  describe("invalid inputs", () => {
    it.each`
      value
      ${""}
      ${"not-a-date"}
      ${"2024-13-01"}
      ${"2024-02-30"}
      ${"2024-02-29T12:00:00"}
      ${null}
      ${undefined}
      ${42}
      ${true}
    `("returns '' for invalid value $value", ({ value }) => {
      expect(formatRelativeDate(value as never, MustTestLocales.enUS)).toBe("");
    });

    it("returns '' when reference is provided but invalid", () => {
      expect(
        formatRelativeDate("2024-03-12", MustTestLocales.enUS, {
          reference: "not-a-date",
        }),
      ).toBe("");
    });

    it("returns '' when reference is an empty string", () => {
      expect(
        formatRelativeDate("2024-03-12", MustTestLocales.enUS, {
          reference: "",
        }),
      ).toBe("");
    });
  });

  // ---------------------------------------------------------------------------
  // Temporal failures — internal errors must not throw, must return ""
  // ---------------------------------------------------------------------------
  describe("Temporal failures", () => {
    it("returns '' when Temporal.Now.plainDateISO throws (no reference provided)", () => {
      vi.spyOn(Temporal.Now, "plainDateISO").mockImplementation(() => {
        throw new Error("simulated failure");
      });
      expect(formatRelativeDate("2024-03-12", MustTestLocales.enUS)).toBe("");
    });
  });
});
