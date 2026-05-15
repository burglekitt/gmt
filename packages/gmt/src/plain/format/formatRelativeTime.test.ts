import { Temporal } from "@js-temporal/polyfill";
import { vi } from "vitest";
import { MustTestLocales } from "../../test";
import { mockTemporalPlainTimeFromThrow } from "../../test/mocks";
import { formatRelativeTime } from "./formatRelativeTime";

const REF = "12:00:00";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Auto unit selection
  // second (<60s), minute (60s–3599s), hour (3600s+)
  // ---------------------------------------------------------------------------
  describe("auto unit selection", () => {
    it.each`
      value         | expected
      ${"11:59:30"} | ${"30 seconds ago"}
      ${"12:00:30"} | ${"in 30 seconds"}
      ${"11:30:00"} | ${"30 minutes ago"}
      ${"12:30:00"} | ${"in 30 minutes"}
      ${"10:00:00"} | ${"2 hours ago"}
      ${"14:00:00"} | ${"in 2 hours"}
    `("formats $value relative to REF as $expected", ({ value, expected }) => {
      expect(
        formatRelativeTime(value, MustTestLocales.enUS, { reference: REF }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // ±1 and 0 permutations
  // ---------------------------------------------------------------------------
  describe("±1 and 0 permutations", () => {
    it.each`
      value         | expected
      ${"12:00:00"} | ${"now"}
      ${"12:00:01"} | ${"in 1 second"}
      ${"11:59:59"} | ${"1 second ago"}
      ${"12:01:00"} | ${"in 1 minute"}
      ${"11:59:00"} | ${"1 minute ago"}
      ${"13:00:00"} | ${"in 1 hour"}
      ${"11:00:00"} | ${"1 hour ago"}
    `("formats $value (en-US, auto) as $expected", ({ value, expected }) => {
      expect(
        formatRelativeTime(value, MustTestLocales.enUS, { reference: REF }),
      ).toBe(expected);
    });
  });

  // ---------------------------------------------------------------------------
  // Locale coverage — 30 minutes past
  // ---------------------------------------------------------------------------
  describe("locale coverage — 30 minutes past", () => {
    const value = "11:30:00";

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
      expect(formatRelativeTime(value, locale, { reference: REF })).toBe(
        expected,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Locale coverage — 30 minutes future
  // ---------------------------------------------------------------------------
  describe("locale coverage — 30 minutes future", () => {
    const value = "12:30:00";

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
      expect(formatRelativeTime(value, locale, { reference: REF })).toBe(
        expected,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // style option
  // ---------------------------------------------------------------------------
  describe("style option", () => {
    const value = "11:30:00";

    it.each`
      style       | expected
      ${"long"}   | ${"30 minutes ago"}
      ${"short"}  | ${"30 min. ago"}
      ${"narrow"} | ${"30m ago"}
    `("style:$style formats -30min as $expected", ({ style, expected }) => {
      expect(
        formatRelativeTime(value, MustTestLocales.enUS, {
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
      value         | numeric     | expected
      ${"12:00:00"} | ${"auto"}   | ${"now"}
      ${"12:00:00"} | ${"always"} | ${"in 0 seconds"}
      ${"12:01:00"} | ${"auto"}   | ${"in 1 minute"}
      ${"12:01:00"} | ${"always"} | ${"in 1 minute"}
      ${"11:59:00"} | ${"auto"}   | ${"1 minute ago"}
      ${"11:59:00"} | ${"always"} | ${"1 minute ago"}
    `(
      "numeric:$numeric for $value → $expected",
      ({ value, numeric, expected }) => {
        expect(
          formatRelativeTime(value, MustTestLocales.enUS, {
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
      value         | largestUnit | expected
      ${"11:59:30"} | ${"second"} | ${"30 seconds ago"}
      ${"12:00:30"} | ${"second"} | ${"in 30 seconds"}
      ${"11:30:00"} | ${"minute"} | ${"30 minutes ago"}
      ${"12:30:00"} | ${"minute"} | ${"in 30 minutes"}
      ${"10:00:00"} | ${"hour"}   | ${"2 hours ago"}
      ${"14:00:00"} | ${"hour"}   | ${"in 2 hours"}
    `(
      "largestUnit:$largestUnit for $value → $expected",
      ({ value, largestUnit, expected }) => {
        expect(
          formatRelativeTime(value, MustTestLocales.enUS, {
            reference: REF,
            largestUnit,
          }),
        ).toBe(expected);
      },
    );

    it("largestUnit:second forces second for a 90-second diff", () => {
      expect(
        formatRelativeTime("11:58:30", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "second",
          numeric: "always",
        }),
      ).toBe("90 seconds ago");
    });

    it("largestUnit:minute forces minute for a 2-hour diff", () => {
      expect(
        formatRelativeTime("10:00:00", MustTestLocales.enUS, {
          reference: REF,
          largestUnit: "minute",
          numeric: "always",
        }),
      ).toBe("120 minutes ago");
    });
  });

  // ---------------------------------------------------------------------------
  // Invalid inputs — must return ""
  // ---------------------------------------------------------------------------
  describe("invalid inputs", () => {
    it.each`
      value
      ${""}
      ${"not-a-time"}
      ${"25:00:00"}
      ${"12:60:00"}
      ${"2024-03-15"}
      ${"2024-03-15T12:00:00"}
      ${null}
      ${undefined}
      ${42}
      ${true}
    `("returns '' for invalid value $value", ({ value }) => {
      expect(formatRelativeTime(value as never, MustTestLocales.enUS)).toBe("");
    });

    it("returns '' when reference is provided but invalid", () => {
      expect(
        formatRelativeTime("11:30:00", MustTestLocales.enUS, {
          reference: "not-a-time",
        }),
      ).toBe("");
    });

    it("returns '' when reference is an empty string", () => {
      expect(
        formatRelativeTime("11:30:00", MustTestLocales.enUS, {
          reference: "",
        }),
      ).toBe("");
    });
  });

  // ---------------------------------------------------------------------------
  // Temporal failures — internal errors must not throw, must return ""
  // ---------------------------------------------------------------------------
  describe("Temporal failures", () => {
    it("returns '' when Temporal.Now.plainTimeISO throws (no reference provided)", () => {
      vi.spyOn(Temporal.Now, "plainTimeISO").mockImplementation(() => {
        throw new Error("simulated failure");
      });
      expect(formatRelativeTime("11:30:00", MustTestLocales.enUS)).toBe("");
    });

    it("returns '' when Temporal.PlainTime.from throws", () => {
      mockTemporalPlainTimeFromThrow();
      expect(
        formatRelativeTime("11:30:00", MustTestLocales.enUS, {
          reference: REF,
        }),
      ).toBe("");
    });
  });
});
