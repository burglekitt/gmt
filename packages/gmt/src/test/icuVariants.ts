/**
 * CLDR data embedded in Node's ICU build changes between major ICU
 * versions (which track Node major versions — see
 * https://nodejs.org/en/download/releases for the ICU version each Node
 * release ships). A handful of goldens in this suite depend on locale
 * strings that changed wording between ICU 77 (Node 20) and ICU 78
 * (Node 22/24) — e.g. pt-PT's day period ("da tarde" -> "p.m."), Turkish
 * and Korean long time zone names, and Hebrew/Swedish relative-time
 * phrasing. These are not "full" vs "partial" ICU — every Node LTS here
 * ships complete locale data; the *wording* CLDR chose for a given
 * locale/option simply changed.
 *
 * `oneOfIcu` accepts any of the known-valid strings for a case like this,
 * so the assertion still fails if the formatter starts returning
 * something else, but doesn't fail on a CLDR wording revision alone.
 *
 * Use this only for goldens verified (against real Node 20/22/24 runs) to
 * differ solely by CLDR wording, not for masking an actual bug — every
 * variant listed should be independently confirmed to come from a real
 * ICU version.
 */
export function oneOfIcu(...variants: string[]): Set<string> {
  return new Set(variants);
}

export function expectOneOfIcu(actual: string, variants: Set<string>): void {
  if (!variants.has(actual)) {
    throw new Error(
      `Expected one of ${JSON.stringify([...variants])}, got ${JSON.stringify(actual)}`,
    );
  }
}
