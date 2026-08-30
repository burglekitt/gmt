# Execution spec — DOX-B1 (`DOX-B1a` + `DOX-B1b`)

**Load:** `.agents/dox/tier2-widgets.md` (the Tier 2 reference pack)
**Read:** `context/dox/issues/DOX-B.md` (the full issue spec)
**Do not read:** any other tier pack

---

## Current state (verified 2026-08-29)

DOX-B1a's **component is already built and functional**:

| Artifact                                   | Status                                                         |
| ------------------------------------------ | -------------------------------------------------------------- |
| `src/components/Playground.astro`          | ✅ Island with `client:visible`                                |
| `src/lib/playground-register.ts`           | ✅ Custom element: dynamic import, compute, sentinel rendering |
| `src/lib/playground-spec.ts`               | ✅ 29 specs across 11 modules                                  |
| `src/lib/gmt-modules.ts`                   | ✅ 21 module-barrel dynamic imports                            |
| `src/styles/gmt-playground.css`            | ✅ Full styling (glass, bevel, sentinel amber, live glow)      |
| `scripts/build-reference.ts` lines 791–795 | ✅ Auto-embeds `<Playground>` where spec exists                |
| `src/reference-types.ts`                   | ✅ `PlaygroundSpec`, `WidgetSeed`, `WidgetExample` types       |

DOX-B1b's **permalink mechanism does not exist** — zero URL serialization/rehydration
logic anywhere in `apps/dox/src/`.

---

## Task 1 — DOX-B1a: Verify and close gaps

### 1a. Verify the playground works on `startOfZoned`'s generated page

```bash
eval "$(fnm env)" && fnm use && pnpm nx run dox:generate
```

Then read `src/content/docs/reference/zoned/calculate/startOfZoned.mdx` and confirm:

1. It contains `<Playground specId="startOfZoned" client:visible />`
2. It contains the `## Parameters` and `## Options` tables
3. The import line shows `@northguild/gmt/zoned/calculate` (module granularity)

### 1b. Verify polyfill loading pattern

Check that:

1. **No `@js-temporal/polyfill` import exists** in any `apps/dox/src/` file (already
   verified — grep returns empty).
2. The polyfill only loads via module barrels in `gmt-modules.ts`, which are
   dynamically imported inside the `connectedCallback()` of `PlaygroundElement`.
3. Pages without a `<Playground>` island do not import any `@northguild/gmt` module
   at all — the only imports are Starlight's own.

### 1c. Verify sentinel rendering

Read `src/lib/playground-register.ts` and confirm:

1. `isSentinel(returnType, value)` correctly maps:
   - `"string"` → `value === ""`
   - `"number"` → `value === null`
   - `"boolean"` → `value === false`
   - `"array"` → `Array.isArray(value) && value.length === 0`
2. Sentinel renders as `⟨ NO SIGNAL — invalid input ⟩` (or `sentinelLabel` override)
3. Non-sentinel renders with `gmt-playground-live` class (spring glow)
4. `renderError()` also uses the sentinel style for module-load failures

### 1d. Verify option-object support

Read `src/lib/playground-register.ts`'s `readArgs()` and confirm:

1. Positional params are read from `[data-param]` elements
2. Option-object params are collected from `[data-option]` elements into a `Record`
3. The options object is pushed as the last argument

### 1e. Verify keyboard operability

All inputs in `Playground.astro` are native `<input type="text">` and `<select>`
elements. No custom keyboard handling needed — native tab order and IME support
work automatically.

### 1f. Expand playground specs if needed

The current 29 specs cover the core namespaces. If any module used by a generated
reference page lacks a spec, add one. The goal is that every namespace represented
in `GMT_MODULES` has at least one spec so the generator's `if (PLAYGROUND_SPECS[doc.name])`
check produces a playground on at least one page per namespace.

**Do NOT add specs for every function** — B2a handles bulk auto-embed. B1a's specs
are the design proof and the hand-curated examples.

### 1g. Add missing modules to GMT_MODULES

The current 21 entries cover the 29 specs. But B2a–d will need more. Pre-populate
`GMT_MODULES` with all module barrels that exist in `packages/gmt/src/`:

Walk `packages/gmt/src/*/` and for each subdirectory that has an `index.ts` exporting
functions, add an entry. This ensures B2a–d can import any module without first
discovering a missing entry.

---

## Task 2 — DOX-B1b: Build the widget permalink mechanism

### Overview

Build a **shared URL state serialization utility** that every Tier 2 widget uses.
Design it now so DOX-B2a–d can integrate it when they ship. The Playground component
gets the first integration.

### 2a. Create `src/lib/widget-state.ts`

A class `WidgetStateManager` with:

```ts
class WidgetStateManager {
  // Serialize state to a URL hash fragment
  static serialize(type: string, state: Record<string, unknown>): string;

  // Deserialize state from a URL hash fragment
  static deserialize(
    type: string,
    hash: string,
  ): Record<string, unknown> | null;

  // Subscribe to DOM changes on a widget root, debounce, write to URL
  static observe(root: HTMLElement, type: string): () => void;

  // On widget connect: read URL, apply state to inputs, return true if hydrated
  static hydrate(root: HTMLElement, type: string): boolean;
}
```

**Design decisions:**

1. **Use the URL hash** (`#widget=<type>&<key>=<value>&…`), not query string:
   - Hash changes don't trigger navigation or server round-trips
   - Multiple widgets can coexist without query-string collisions
   - Starlight/Astro routing is unaffected

2. **Format:** `#widget=<type>&<encoded-key>=<encoded-value>&…`
   - `type` is the widget identifier (`playground`, `dst-inspector`, `interval-viz`, `converter`)
   - Each key-value pair is `encodeURIComponent`/`decodeURIComponent`
   - Arrays (e.g. interval endpoints) use `key[]=val1&key[]=val2`

3. **Debounce:** `observe()` debounces URL writes by 150ms to avoid flooding
   `history.replaceState` during rapid input.

4. **Back/forward:** Use `history.pushState` on significant changes (select changes,
   not every keystroke), or always `replaceState` and let the browser's natural
   back-button behavior handle page-level navigation. **Do not fight the back button.**
   The widget state is a fragment detail, not a navigation event.

### 2b. Integrate with the Playground component

Modify `Playground.astro` and `playground-register.ts`:

1. Add a `widgetId` attribute to `<gmt-playground>` (derived from `specId`)
2. In `connectedCallback()`:
   - Call `WidgetStateManager.hydrate(this, specId)` BEFORE `this.compute()`
   - If hydrated, skip the default input values (the URL state takes precedence)
   - After `compute()`, call `WidgetStateManager.observe(this, specId)` to start
     listening for changes
3. Add a "Copy permalink" button next to the existing "Copy call" button
4. On permalink copy: serialize current state, construct full URL (`window.location.origin
   - window.location.pathname + '#' + serialized`), copy to clipboard

### 2c. Add a permalink test

In a new or existing test file, test `WidgetStateManager`:

1. Round-trip: serialize a state object, deserialize it, get the same object back
2. Multiple widget types can coexist in the same hash
3. Malformed hash returns `null` (does not throw)
4. Hydration applies state to matching inputs by name

### 2d. Do NOT implement B2a–d widget integrations yet

B1b's DoD says it depends on B2a–d. Build the mechanism so B2a–d can use it, but
don't integrate it with widgets that don't exist yet. The Playground integration
(B1a's widget) is the proof-of-concept.

---

## Definition of Done — verbatim from `context/dox/issues/DOX-B.md`

### DOX-B1a

- [ ] A playground on `startOfZoned`'s page recomputes live when `disambiguation` is
      changed between `"compatible"`, `"earlier"`, `"later"`, and `"reject"`, and
      correctly shows the `"reject"` case producing the sentinel.
- [ ] An invalid input renders the signal-lost treatment, not a blank field.
- [ ] Output values are produced by the real library — verify by breaking a gmt function
      locally and confirming the playground breaks with it.
- [ ] Lighthouse/devtools confirm the polyfill is not loaded on pages without a
      playground, and confirm no page imports at namespace granularity.
- [ ] Keyboard-operable: every input reachable and editable without a mouse.

### DOX-B1b

- [ ] Every widget shipped in `DOX-B1a`/`DOX-B2a`–`d` can be configured, copied as a URL,
      opened in a new tab, and reproduces the exact same state.
- [ ] Back/forward navigation behaves sensibly with widget state changes.

---

## Verification commands

```bash
# Always prefix with:
eval "$(fnm env)" && fnm use

# Monorepo green:
pnpm nx run-many -t lint test typecheck build

# Dox-specific:
pnpm nx run dox:generate
pnpm nx run dox:build
pnpm nx run dox:test
```

---

## Files to create

| File                      | Purpose                                                         |
| ------------------------- | --------------------------------------------------------------- |
| `src/lib/widget-state.ts` | `WidgetStateManager` — serialize, deserialize, observe, hydrate |

## Files to modify

| File                              | Changes                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `src/components/Playground.astro` | Add permalink button; pass `widgetId` to element                                     |
| `src/lib/playground-register.ts`  | Integrate `WidgetStateManager` — hydrate on connect, observe changes, permalink copy |
| `src/lib/gmt-modules.ts`          | Add any missing module barrels discovered in Task 1g                                 |
| `src/lib/playground-spec.ts`      | Add specs for any namespaces missing coverage                                        |
