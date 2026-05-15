import { vi } from "vitest";
import { MustTestLocales } from "../../test";
import { mockTemporalNowPlainDateTimeISOThrow } from "../../test/mocks";
import { formatRelativeDateTime } from "./formatRelativeDateTime";

const REF = "2024-03-15T12:00:00";

describe("formatRelativeDateTime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Auto unit selection
  // second (<60s), minute (60s–3599s), hour (3600s–86399s), day (86400s+)
  // ---------------------------------------------------------------------------
  describe("auto unit selection", () => {
    it.each`
      value                    | expected
      ${"2024-03-15T11:59:30"} | ${"30 seconds ago"}
      ${"2024-03-15T12:00:30"} | ${"in 30 seconds"}
      ${"2024-03-15T11:30:00"} | ${"30 minutes ago"}
      ${"2024-03-15T12:30:00"} | ${"in 30 minutes"}
      ${"2024-03-15T09:00:00"} | ${"3 hours ago"}
      ${"2024-03-15T15:00:00"} | ${"in 3 hours"}
      ${"2024-03-12T12:00:00"} | ${"3 days ago"}
      ${"2024-03-18T12:00:00"} | ${"in 3 days"}
    `("formats $value relative to REF as $expected", ({ value, expected }) => {
      expect(
        formatRelativeDateTime(value, MustTestLocales.enUS, {
          reference: REF,
        }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // ±1 and 0 permutations
  // ---------------------------------------------------------------------------
  describe("±1 and 0 permutations", () => {
    it.each`
      value                    | expected
      ${"2024-03-15T12:00:00"} | ${"now"}
      ${"2024-03-15T12:00:01"} | ${"in 1 second"}
      ${"2024-03-15T11:59:59"} | ${"1 second ago"}
      ${"2024-03-15T12:01:00"} | ${"in 1 minute"}
      ${"2024-03-15T11:59:00"} | ${"1 minute ago"}
      ${"2024-03-15T13:00:00"} | ${"in 1 hour"}
      ${"2024-03-15T11:00:00"} | ${"1 hour ago"}
      ${"2024-03-16T12:00:00"} | ${"tomorrow"}
      ${"2024-03-14T12:00:00"} | ${"yesterday"}
    `("formats $value (en-US, auto) as $expected", ({ value, expected }) => {
      expect(
        formatRelativeDateTime(value, MustTestLocales.enUS, {
          reference: REF,
        }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Locale coverage — 30 minutes past
  // ---------------------------------------------------------------------------
  describe("locale coverage — 30 minutes past", () => {
    const value = "2024-03-15T11:30:00";

    it.each`
      locale                  | expected
      ${MustTestLocales.enUS} | ${"30 minutes ago"}
      ${MustTestLocales.enGB} | ${"30 minutes ago"}
      ${MustTestLocales.deDE} | ${"vor 30 Minuten"}
      ${MustTestLocales.frFR} | ${"il y a 30 minutes"}
      ${MustTestLocales.esES} | ${"hace 30 minutos"}
      ${MustTestLocales.itIT} | ${"30 minuti fa"}
      ${MustTestLocales.ptPT} | ${"há 30 minutos"}
      ${MustTestLocales.svSE} | ${"för 30 minuter sedan"}
      ${MustTestLocales.isIS} | ${"fyrir 30 mínútum"}
      ${MustTestLocales.zhCN} | ${"30分钟前"}
      ${MustTestLocales.zhTW} | ${"30 分鐘前"}
      ${MustTestLocales.jaJP} | ${"30 分前"}
      ${MustTestLocales.koKR} | ${"30분 전"}
      ${MustTestLocales.arSA} | ${"قبل ٣٠ دقيقة"}
      ${MustTestLocales.heIL} | ${"לפני 30 דקות"}
      ${MustTestLocales.ruRU} | ${"30 минут назад"}
      ${MustTestLocales.trTR} | ${"30 dakika önce"}
    `("formats for $locale as $expected", ({ locale, expected }) => {
      expect(formatRelativeDateTime(value, locale, { reference: REF })).toBe(
        expected,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Locale coverage — 30 minutes future
  // ---------------------------------------------------------------------------
  describe("locale coverage — 30 minutes future", () => {
    const value = "2024-03-15T12:30:00";

    it.each`
      locale                  | expected
      ${MustTestLocales.enUS} | ${"in 30 minutes"}
      ${MustTestLocales.enGB} | ${"in 30 minutes"}
      ${MustTestLocales.deDE} | ${"in 30 Minuten"}
      ${MustTestLocales.frFR} | ${"dans 30 minutes"}
      ${MustTestLocales.esES} | ${"dentro de 30 minutos"}
      ${MustTestLocales.itIT} | ${"tra 30 minuti"}
      ${MustTestLocales.ptPT} | ${"dentro de 30 minutos"}
      ${MustTestLocales.svSE} | ${"om 30 minuter"}
      ${MustTestLocales.isIS} | ${"eftir 30 mínútur"}
      ${MustTestLocales.zhCN} | ${"30分钟后"}
      ${MustTestLocales.zhTW} | ${"30 分鐘後"}
      ${MustTestLocales.jaJP} | ${"30 分後"}
      ${MustTestLocales.koKR} | ${"30분 후"}
      ${MustTestLocales.arSA} | ${"خلال ٣٠ دقيقة"}
      ${MustTestLocales.heIL} | ${"בעוד 30 דקות"}
      ${MustTestLocales.ruRU} | ${"через 30 минут"}
      ${MustTestLocales.trTR} | ${"30 dakika sonra"}
    `("formats for $locale as $expected", ({ locale, expected }) => {
      expect(formatRelativeDateTime(value, locale, { reference: REF })).toBe(
        expected,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // style option
  // ---------------------------------------------------------------------------
  describe("style option", () => {
    const value = "2024-03-15T11:30:00";

    it.each`
      style       | expected
      ${"long"}   | ${"30 minutes ago"}
      ${"short"}  | ${"30 min. ago"}
      ${"narrow"} | ${"30m ago"}
    `("style:$style formats -30min as $expected", ({ style, expected }) => {
      expect(
        formatRelativeDateTime(value, MustTestLocales.enUS, {
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
      value                    | numeric     | expected
      ${"2024-03-15T12:00:00"} | ${"auto"}   | ${"now"}
      ${"2024-03-15T12:00:00"} | ${"always"} | ${"in 0 seconds"}
      ${"2024-03-16T12:00:00"} | ${"auto"}   | ${"tomorrow"}
      ${"2024-03-16T12:00:00"} | ${"always"} | ${"in 1 day"}
      ${"2024-03-14T12:00:00"} | ${"auto"}   | ${"yesterday"}
      ${"2024-03-14T12:00:00"} | ${"always"} | ${"1 day ago"}
    `(
      "numeric:$numeric for $value → $expected",
      ({ value, numeric, expected }) => {
        expect(
          formatRelativeDateTime(value, MustTestLocales.enUS, {
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
      value                    | largestUnit | expected
      ${"2024-03-15T11:59:30"} | ${"minute"} | ${"0 minutes ago"}
      ${"2024-03-15T09:00:00"} | ${"minute"} | ${"180 minutes ago"}
      ${"2024-03-15T11:30:00"} | ${"hour"}   | ${"0 hours ago"}
      ${"2024-03-15T09:00:00"} | ${"hour"}   | ${"3 hours ago"}
      ${"2024-03-12T12:00:00"} | ${"day"}    | ${"3 days ago"}
      ${"2024-03-18T12:00:00"} | ${"day"}    | ${"in 3 days"}
    `(
      "largestUnit:$largestUnit for $value → $expected",
      ({ value, largestUnit, expected }) => {
        expect(
          formatRelativeDateTime(value, MustTestLocales.enUS, {
            reference: REF,
            largestUnit,
            numeric: "always",
          }),
        ).toBe(expected);
      },
    );

    it("largestUnit:month — 2 months ago", () => {
      expect(
        formatRelativeDateTime("2024-01-15T12:00:00", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "month",
        }),
      ).toBe("2 months ago");
    });

    it("largestUnit:month — in 2 months", () => {
      expect(
        formatRelativeDateTime("2024-05-15T12:00:00", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "month",
        }),
      ).toBe("in 2 months");
    });

    it("largestUnit:year — last year", () => {
      expect(
        formatRelativeDateTime("2023-03-15T12:00:00", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "year",
        }),
      ).toBe("last year");
    });

    it("largestUnit:year — next year", () => {
      expect(
        formatRelativeDateTime("2025-03-15T12:00:00", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "year",
        }),
      ).toBe("next year");
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
      ${"2024-03-15"}
      ${"2024-13-01T00:00:00"}
      ${"2024-02-30T00:00:00"}
      ${"2024-12-31T23:59:60"}
      ${null}
      ${undefined}
      ${42}
      ${true}
    `("returns '' for invalid value $value", ({ value }) => {
      expect(formatRelativeDateTime(value as never, MustTestLocales.enUS)).toBe(
        "",
      );
    });

    it("returns '' when reference is provided but invalid", () => {
      expect(
        formatRelativeDateTime("2024-03-15T12:00:00", MustTestLocales.enUS, {
          reference: "not-a-date",
        }),
      ).toBe("");
    });

    it("returns '' when reference is a plain date (no time component)", () => {
      expect(
        formatRelativeDateTime("2024-03-15T12:00:00", MustTestLocales.enUS, {
          reference: "2024-03-15",
        }),
      ).toBe("");
    });

    it("returns '' when reference is an empty string", () => {
      expect(
        formatRelativeDateTime("2024-03-15T12:00:00", MustTestLocales.enUS, {
          reference: "",
        }),
      ).toBe("");
    });
  });

  // ---------------------------------------------------------------------------
  // Temporal failures — internal errors must not throw, must return ""
  // ---------------------------------------------------------------------------
  describe("Temporal failures", () => {
    it("returns '' when Temporal.Now.plainDateTimeISO throws (no reference provided)", () => {
      mockTemporalNowPlainDateTimeISOThrow();
      expect(
        formatRelativeDateTime("2024-03-15T12:00:00", MustTestLocales.enUS),
      ).toBe("");
    });
  });
});
