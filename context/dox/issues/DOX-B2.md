# Plan: DOX-B2a — Auto-embed playgrounds into every generated @example

**TL;DR:** Every `@example` in generated MDX renders as a static code block (for
no-JS fallback and Pagefind indexing) plus a "Try it" button. Clicking the button
mounts a live playground textarea seeded with that example's own call string.
Zero islands hydrate on page load — the GMT polyfill is only imported when a
reader explicitly asks for a playground.

## Steps

1. Generate per-example templates — `build-reference.ts` emits one template per
   `@example` tag with key `fnName-example-{i}`, seeded with that example's
   `call` string. Also emits a function-level key `fnName` (pointing to the
   first example) for use in `Scenario.astro` and `Mistake.astro`. 1871
   templates generated across all functions.
2. Render button + slot — `renderFn()` outputs a `<button data-gmt-playground-trigger>`
   followed by an empty `<div data-gmt-playground-target>` after each static code
   block. No Astro island is mounted.
3. Client initialization — `playground-init.ts` (a plain `.ts` module imported
   as a side effect in generated MDX) assigns `window.__gmtPlaygroundMount` and
   sets up a single delegated click handler on `document`. When a trigger button
   is clicked, it calls `mountPlayground(specId, target)` which builds the
   playground DOM and initializes it.
4. Component restored — `PlaygroundLive.astro` is restored as a renderable
   component (used by `Mistake.astro` and `Scenario.astro`) that renders the
   playground inline on mount.
5. CSS — `.gmt-playground-trigger` and `.gmt-playground-slot` styles added to
   `gmt-live-playground.css`.

## Relevant files

- `apps/dox/scripts/build-reference.ts` — `renderFn()` emits button + slot;
  template collection loop emits per-example + function-level keys
- `apps/dox/src/lib/playground-init.ts` — client-side init (mount function +
  click delegation)
- `apps/dox/src/components/PlaygroundLive.astro` — renderable component for
  Mistake/Scenario pages
- `apps/dox/src/lib/playground-spec.ts` — `LivePlaygroundTemplate` type
- `apps/dox/src/lib/playground-parsers.ts` — `splitTopLevel`, `parseCallArgs`
- `apps/dox/src/lib/playground-client.ts` — `evaluateArg`, `renderResult`, `sentinelFor`
- `apps/dox/src/styles/gmt-live-playground.css` — playground + trigger button styles

## Verification

- `pnpm nx run dox:generate` — verify 1871 templates generated
- `pnpm nx run dox:dev` — open a reference page (e.g. `/reference/plain/calculate/addBusinessDays`):
  - Static code blocks visible on load
  - No playground islands in DOM initially (no textarea/output)
  - Click "Try it" → playground mounts with correct seed value, runs, shows output
  - Click second "Try it" → mounts independently
  - Edit textarea, click Run → output updates
  - Invalid input → amber "NO SIGNAL"
- `pnpm nx run-many -t lint test typecheck build` — all green

## Decisions

- **Textarea, not typed inputs.** The generator classifies every param into
  `{ type, value, options, unitValue }` but a per-param widget system (enum selects,
  units selects, array inputs) adds significant complexity for marginal gain. A
  single `<textarea>` where the user types any JS expression calling the real library
  is simpler, more flexible, and already handles all param types including arrays.
- **Hydrate on interaction.** Each example renders a "Try it" button instead of
  auto-mounting an island. The `@js-temporal/polyfill` (~3MB) is only imported when
  a reader explicitly asks for a playground. This keeps reference pages lightweight
  — a function with five examples does not load five copies of the polyfill on page
  load.
- **Static code blocks remain.** Every `@example` renders as a visible code block
  for no-JS fallback and Pagefind indexing. The playground is an enhancement, not a
  replacement.
- **Plain `.ts` for init, `.astro` for component.** The click-delegation script
  lives in `playground-init.ts` (not `.astro`) so it can be imported as a side
  effect without pulling the Astro compiler into the dependency graph. The
  `PlaygroundLive.astro` component is kept for pages that need an inline playground
  (Mistake, Scenario).
