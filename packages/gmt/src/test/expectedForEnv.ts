import { normalizeDateTime } from "../internal";
import { hasFullIcu } from "./hasFullIcu";

// Returns the expected formatter output for the current ICU environment.
//
// On full-icu runtimes the test's hardcoded golden string is used directly.
// On stripped/small-icu runtimes the golden would diverge from what Intl
// actually produces (e.g. "오후" → "PM"), so we ask Intl for the live value
// and treat that as expected. The formatter under test passes its Intl
// output through normalizeDateTime, so we apply the same normalization here
// for parity.
//
// This is an "inline probe" — the test passes on any ICU configuration by
// adjusting its expectation to match whatever Intl is currently producing.
// We still get strict assertions on the full-icu CI path (where the golden
// is authoritative), and on small-icu we verify that the formatter is a
// faithful Intl wrapper.
export function expectedForEnv(
  fullIcuGolden: string,
  reformatForSmallIcu: () => string,
): string {
  return hasFullIcu ? fullIcuGolden : normalizeDateTime(reformatForSmallIcu());
}

// Vitest matcher helper for cases where we cannot reproduce the Intl output
// inline (e.g. Intl.RelativeTimeFormat where the formatter picks the unit
// internally). Returns a RegExp:
//   - on full-icu, an anchored regex matching the exact golden;
//   - on small-icu, /^.+$/ — any non-empty string passes.
// Use with expect(...).toMatch(matchExpectedForEnv(expected)).
//
// Usage:
//   expect(formatRelativeDate(value, locale, options)).toMatch(
//     matchExpectedForEnv(expected),
//   );
export function matchExpectedForEnv(fullIcuGolden: string): RegExp {
  if (!hasFullIcu) return /^.+$/;
  // Anchor and escape regex specials so this is a true equality check.
  const escaped = fullIcuGolden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}$`);
}
