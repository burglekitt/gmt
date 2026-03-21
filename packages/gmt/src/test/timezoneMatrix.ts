import { MustTestLocales } from "./localeMatrix";

/**
 * Canonical timezone IDs that stress offset and date-boundary behavior.
 *
 * Example lookups:
 * - MustTestDstTimezones["UTC"] => "UTC"
 * - MustTestDstTimezones["America/New_York"] => "America/New_York"
 * - MustTestDstTimezones["Europe/Helsinki"] => "Europe/Helsinki"
 * - MustTestDstTimezones["Pacific/Apia"] => "Pacific/Apia"
 * - MustTestDstTimezones["Pacific/Niue"] => "Pacific/Niue"
 */
export const MustTestDstTimezones = {
  "America/New_York": "America/New_York",
  "Asia/Shanghai": "Asia/Shanghai",
  "Asia/Kolkata": "Asia/Kolkata",
  "Asia/Kathmandu": "Asia/Kathmandu",
  "Pacific/Chatham": "Pacific/Chatham",
  "Pacific/Apia": "Pacific/Apia",
  "Pacific/Niue": "Pacific/Niue",
  UTC: "UTC",
  "Etc/GMT": "Etc/GMT",
  "Europe/Helsinki": "Europe/Helsinki",
} as const;

/**
 * Locale to representative timezone mapping for locale-aware APIs.
 *
 * Examples from this map:
 * - MustTestLocaleTimezones[MustTestLocales.enUS] => "America/New_York"
 *
 * Related matrix examples used by timezone-centric tests:
 * - MustTestDstTimezones["UTC"] => "UTC"
 * - MustTestDstTimezones["Europe/Helsinki"] => "Europe/Helsinki"
 * - MustTestDstTimezones["Pacific/Apia"] => "Pacific/Apia"
 * - MustTestDstTimezones["Pacific/Niue"] => "Pacific/Niue"
 */
export const MustTestLocaleTimezones = {
  [MustTestLocales.enUS]: "America/New_York",
  [MustTestLocales.enGB]: "Europe/London",
  [MustTestLocales.deDE]: "Europe/Berlin",
  [MustTestLocales.frFR]: "Europe/Paris",
  [MustTestLocales.esES]: "Europe/Madrid",
  [MustTestLocales.itIT]: "Europe/Rome",
  [MustTestLocales.ptPT]: "Europe/Lisbon",
  [MustTestLocales.svSE]: "Europe/Stockholm",
  [MustTestLocales.isIS]: "Atlantic/Reykjavik",
  [MustTestLocales.zhCN]: "Asia/Shanghai",
  [MustTestLocales.zhTW]: "Asia/Taipei",
  [MustTestLocales.jaJP]: "Asia/Tokyo",
  [MustTestLocales.koKR]: "Asia/Seoul",
  [MustTestLocales.arSA]: "Asia/Riyadh",
  [MustTestLocales.heIL]: "Asia/Jerusalem",
  [MustTestLocales.ruRU]: "Europe/Moscow",
  [MustTestLocales.trTR]: "Europe/Istanbul",
} as const;

/**
 * Union view used by tests that need a single "must test" timezone set.
 *
 * Example lookups:
 * - MustTestTimezones["UTC"] => "UTC"
 * - MustTestTimezones["America/New_York"] => "America/New_York"
 * - MustTestTimezones["Europe/Helsinki"] => "Europe/Helsinki"
 * - MustTestTimezones["Pacific/Apia"] => "Pacific/Apia"
 * - MustTestTimezones["Pacific/Niue"] => "Pacific/Niue"
 */
export const MustTestTimezones = {
  ...MustTestDstTimezones,
  ...MustTestLocaleTimezones,
};
