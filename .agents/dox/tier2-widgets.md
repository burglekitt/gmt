# Tier 2 reference pack — the widget platform (`DOX-B1a`, `DOX-B1b`, `DOX-B2a`–`DOX-B2d`)

Loaded by `dox-builder` for the widget platform stories. Does not restate
`dox-builder.md`'s universal invariants.

**Verified against the live repo on 2026-08-29.** Everything below was checked by
running the command, reading the file, or building the site — not read out of
`context/dox/`. Where this pack contradicts `context/dox/issues/DOX-B.md`, this pack
is correct and the issue predates the finding.

---

## Verified findings that contradict or refine the issue spec

### 1. The Playground component, `GMT_MODULES` registry, and 29 specs already exist

`DOX-B1a`'s core component is **already built and functional**:

- **`src/components/Playground.astro`** — the island component, hydrated with
  `client:visible`. Renders parameter inputs (text + enum `<select>`), an option-object
  section, a syntax-highlighted call display, and a `<output>` for the result.
- **`src/lib/playground-register.ts`** — the `HTMLElement` subclass that:
  - Dynamically imports the module via `GMT_MODULES` (lazy, per-island)
  - Reads input values, calls the real function, renders the result
  - Detects sentinels via `isSentinel(returnType, value)` and renders the signal-lost
    treatment (amber, bracketed: `⟨ NO SIGNAL — invalid input ⟩`)
  - Handles module-load failures and missing exports gracefully
- **`src/lib/playground-spec.ts`** — 29 `PlaygroundSpec` entries covering functions
  across `zoned/calculate`, `plain/calculate`, `plain/validate`, `plain/compare`,
  `plain/format`, `plain/parse`, `plain/get`, `plain/interval`, `duration`,
  `zoned/validate`, `zoned/convert`
- **`src/lib/gmt-modules.ts`** — 21 module-barrel dynamic imports, all at module
  granularity (e.g. `@northguild/gmt/zoned/calculate`). No namespace imports.
- **`src/styles/gmt-playground.css`** — full styling: glass tint, bevel corners,
  input/select restyling, live-value spring glow, sentinel amber treatment, light-mode
  overrides, reduced-motion handling.
- **`src/reference-types.ts`** — `PlaygroundSpec`, `ParamSpec`, `WidgetSeed`,
  `WidgetExample`, `RouteManifest` types.

The generator (`scripts/build-reference.ts`) already auto-embeds `<Playground>` on
pages where a spec exists (line 791–795: `if (PLAYGROUND_SPECS[doc.name])`).

**Conclusion: DOX-B1a's component work is done. The remaining work is verification,
potential spec expansion, and DOX-B1b's permalink mechanism.**

### 2. Module-granularity imports are enforced — no namespace or per-function imports exist

Verified across all `apps/dox/src/**/*.{ts,astro,mjs}`:

- **Zero** `@northguild/gmt` namespace-level imports (`from "@northguild/gmt/zoned"` etc.)
- **Zero** `@js-temporal/polyfill` direct imports
- All imports go through `GMT_MODULES`'s 21 module-barrel dynamic imports
- The generated MDX pages use `import { fn } from "@northguild/gmt/<ns>/<module>"` (module
  granularity, produced by `build-reference.ts` line 805)

The polyfill (~2.98 MB) only loads when a playground island hydrates, because each
module barrel re-exports `@js-temporal/polyfill` and the dynamic import creates a
separate chunk.

### 3. Widget seeds use raw `call` strings, not parsed arguments

The `WidgetExample` type is:

```ts
interface WidgetExample {
  call: string; // e.g. 'absDuration("-P1DT2H")'
  result: string; // e.g. '"P1DT2H"'
  note?: string; // e.g. '(no relativeTo needed)'
}
```

513 widget seeds are generated. The `call` field is the raw `@example` call string, not
pre-parsed into positional/keyword arguments. **DOX-B2a must parse this in the generator
(better) or in the browser (worse).** The spec notes this decision point.

### 4. GMT_MODULES covers 21 modules — B2a–d will need more

Current registry entries: `zoned/calculate`, `plain/calculate`, `plain/validate`,
`plain/compare`, `plain/format`, `plain/parse`, `plain/get`, `plain/interval`,
`duration`, `zoned/validate`, `zoned/convert`, `zoned/format`, `zoned/get`,
`zoned/compare`, `zoned/parse`, `zoned/map`, `unix/convert`, `utc/convert`,
`utc/format`.

Missing modules that B2a–d will likely need:

- `unix/calculate`, `unix/validate`, `unix/compare`, `unix/format`, `unix/get`,
  `unix/parse`, `unix/interval`, `unix/map`
- `utc/calculate`, `utc/validate`, `utc/compare`, `utc/get`, `utc/parse`,
  `utc/interval`, `utc/map`
- `plain/convert`
- `duration` is covered
- `regex` is not a module barrel — regex consts are imported directly

### 5. The `call` field format is consistent and parseable

Verified across all 1,860 examples:

- 1,859 match the shape `fnName(args) // result` exactly
- Zero contain a second `//`
- Exactly one is multi-line: `getDstTransitions` (array result continues on `* //` lines)
- The parser in `build-reference.ts` splits on `/\s+\/\/\s/` — already working

### 6. DOX-B1b (permalinks) has zero existing implementation

No URL serialization, hash-based state encoding, or rehydration logic exists anywhere in
`apps/dox/src/`. The Playground component reads from DOM inputs only — its state is not
encoded anywhere external.

---

## File paths involved in Tier 2

| File                                        | Role                                                    |
| ------------------------------------------- | ------------------------------------------------------- |
| `src/components/Playground.astro`           | The playground island component                         |
| `src/lib/playground-register.ts`            | `HTMLElement` subclass: dynamic import, compute, render |
| `src/lib/playground-spec.ts`                | 29 `PlaygroundSpec` entries + types                     |
| `src/lib/gmt-modules.ts`                    | 21 module-barrel dynamic imports                        |
| `src/reference-types.ts`                    | `PlaygroundSpec`, `WidgetSeed`, `WidgetExample` types   |
| `src/styles/gmt-playground.css`             | Playground + scenario + mistake styling                 |
| `scripts/build-reference.ts`                | Generator: emits MDX pages with embedded Playground     |
| `src/generated/reference/widget-seeds.ts`   | 513 `WidgetSeed[]` — raw call/result pairs              |
| `src/generated/reference/gmt-corpus.json`   | 588 `CorpusEntry[]` — page content for retrieval        |
| `src/generated/reference/route-manifest.ts` | `Set<string>` of all generated URLs                     |

## Constraints

1. **Module-granularity imports only.** `@northguild/gmt/plain/calculate`. Never
   namespace (`@northguild/gmt/plain` — drags 2.98 MB polyfill) and never per-function
   (forbidden by exports map `"./plain/*/*": null`).

2. **`client:visible` hydration, never `client:load`.** The playground pulls the
   polyfill via module barrels; lazy-load it.

3. **Sentinel rendering is mandatory in every widget.** Invalid input (`""` / `null` /
   `false` / `[]`) renders as `⟨ NO SIGNAL — invalid input ⟩` in signal-lost amber.
   **Distinguish from legitimately empty results** (e.g. `[]` from a non-overlapping
   interval intersection).

4. **Tokens only.** No color literal in component styles. Amber is reserved for
   sentinels.

5. **Restyle native controls; never rebuild from `div`s.** Real `<input>`, `<select>`,
   `<textarea>` with `appearance: none`.

6. **Drag is never the only affordance.** Every draggable handle needs keyboard path
   and typed-input equivalent.

7. **Widget seeds are raw call strings.** The `call` field in `WidgetExample` is not
   pre-parsed. DOX-B2a must decide where to parse it.

## Open decisions that Tier 2 stories must settle

### Decision 1: Where to parse the `call` field (DOX-B2a)

The `call` string format is `fnName(arg1, arg2, { key: val })`. DOX-B2a's auto-embed
needs to turn this into editable inputs.

- **Generator-side parsing (preferred):** Parse once in `build-reference.ts`, emit
  structured seed data. One place, testable, ships no parser to the browser.
- **Browser-side parsing (avoid):** Ships a parser to every reader, more error-prone.

If the generator already parses `call` into `{ call, result, note }` with structured
args, DOX-B2a is small. If it doesn't, this is where that shows up.

### Decision 2: Permalink mechanism scope (DOX-B1b)

The issue says B1b depends on B2a–d (every widget). The mechanism must serialize:

- Text inputs, enum selects, option-object toggles (Playground)
- Zone/year selectors, disambiguation/offset toggles (DST Inspector)
- Dragged interval positions + typed-input equivalents (Interval visualizer)
- Zone pair, format options, regex selector (Converter bench)

Design as **one shared utility** consumed by all five widget types. Do not build five
independent serializers.

**Recommended approach:** A `WidgetStateSerializer` class with:

- `serialize(widgetType, state) → string` (URL hash fragment or query string)
- `deserialize(widgetType, hash) → state`
- `subscribe(widgetElement, onChange)` — listens for input/change/drag events,
  debounces, writes to URL via `history.replaceState` or `pushState`
- On load: read URL, hydrate widget state before first compute

Use the URL **hash** (`#widget-state=…`) rather than query string, because:

- Hash changes don't trigger server round-trips
- Starlight/Astro routing is not affected
- Multiple widgets on one page can each own their own hash key

### Decision 3: Playground spec expansion (DOX-B1a)

29 specs cover the basics. For the DoD to feel complete, consider whether this is
enough. The spec doesn't mandate a minimum count, but the original plan's language
("every one of 1,860 examples becomes runnable") implies broad coverage. B2a handles
the bulk via auto-embed, but B1a's hand-written specs serve as the design proof and
the examples shown on the landing page / high-traffic pages.

---

## Widget summaries (B2a–d)

### DOX-B2a — Auto-embed

Extend `build-reference.ts` to mark up each `@example` as a runnable playground.
The `call` half of each `{ call, result, note }` triple is the seed data.

Key constraint: keep static text as the non-JS fallback. Examples must remain
readable with JavaScript disabled and in the Pagefind index.

### DOX-B2b — DST Transition Inspector

Widget: pick an IANA zone + year → call `getDstTransitions(zone, year)` → render
gap/overlap on a scrubbable local-time axis. Toggle `disambiguation` and `offset`
live against `startOfZoned`.

No model, no key, no server — runs on already-exported functions.

Read `appendix-parked.md` §2 for the original rationale and `startOfZoned.ts`'s
fifth example for the `offset: "prefer"` making `disambiguation` inert behavior.

### DOX-B2c — Interval algebra visualizer

Widget: drag intervals on a shared timeline, watch intersection/union/difference/xor/
abuts/engulfs/overlap update live. Start with `zoned` namespace (richest DST examples).

**Distinguish correct empty result from invalid-input sentinel.** `[]` from a genuine
non-overlap is a correct answer, not a signal-lost state.

### DOX-B2d — Converter + format bench

Widget combining:

- Zone-to-zone conversion (`convertZonedToZoned`)
- Live `formatZonedToParts` output + relative-time formatting with locale switching
- Regex tester over the 22 exported `regex` consts

Each sub-panel runs the real exported function/const. No reimplementation.

Read `regex/` directory's 13 files to confirm full coverage (7 use `//` line-comment
documentation rather than JSDoc, per DOX-A3a's finding).

---

## Named edge cases

1. **`getDstTransitions` multi-line example** — array result continues on `* //` lines.
   The generator already handles this.

2. **`plain/calculate/weekOfYear.ts` exports two functions** — the only file in the
   library that does. "One page per file" holds 503/504 times. The generator handles
   this.

3. **Regex files use `//` comments, not JSDoc** — 13 files in `src/regex/`. The
   generator already handles these (verified: regex MDX pages exist with pattern
   literals).

4. **Sentinel vs. empty array** — `[]` from `intervalIntersectionZoned` for
   non-overlapping intervals is a correct answer. The widget must not render it as
   `⟨ NO SIGNAL ⟩`. Where ambiguous, the widget must say which it is.

5. **`@js-temporal/polyfill` bundle cost** — 2.98 MB unpacked. Only loads on pages
   with a hydrated playground island. Verify with Lighthouse/devtools that pages
   without a playground do not load it.

6. **Native `Temporal` support** — check at build time whether the target browsers
   support `Temporal` natively, which would allow dropping the polyfill from widgets
   entirely. This is the largest free performance win in the epic.

---

## Ordered risk list — most likely to bite first

1. **Polyfill bundle cost on playground pages.** The 2.98 MB polyfill loads via module
   barrels. `client:visible` mitigates this, but a page with multiple playgrounds
   (after B2a) could pull it multiple times. Verify chunk deduplication.

2. **`call` field parsing strategy** (Decision 1 above). If B2a ships a browser-side
   parser, it adds weight to every reference page. If the generator doesn't parse it,
   B2a is harder than it looks.

3. **GMT_MODULES coverage gap.** 21 entries cover the specs, but B2a–d will need
   ~10 more module barrels. Each must be added deliberately, with the correct path.

4. **Permalink mechanism scope creep** (Decision 2). B1b must not grow into five
   independent serializers. One shared utility, designed before B2a–d ship.

5. **Sentinel vs. empty result conflation.** The visual distinction must be clear and
   consistent across all five widget types, not just the playground.
