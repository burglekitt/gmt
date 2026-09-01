# OTEL-E — Browser utility + polish

**Audited 2026-09-01.** All functions map to existing gmt APIs. No invented types. See [overview.md](../overview.md) for the full corrected spec.

Each story below is one logical unit; its sub-stories are nested under it and ordered as
they should be built. The issue stays open until its last sub-story lands.

## Definition of done — binding for every story in this file

- `pnpm nx run-many -t lint test typecheck build` stays green, **including the 20-cell
  GMT timezone matrix**. `packages/gmt-otel` must not perturb `packages/gmt`.
- **Changesets required.** Unlike `apps/dox`, `@northguild/gmt-otel` is published to npm,
  so every story that modifies source needs a `.changeset/*.md` entry.
- No `Date` object anywhere. All inputs are ISO 8601 strings; outputs are strings, numbers,
  booleans, or arrays.
- Wrap all Temporal calls in `try-catch`. Bad input returns sentinels, never throws.

---

### OTEL-E1 — Browser utility (`getCurrentBrowserTimezone`)

**Title:**

```
OTEL-E1 Implement getCurrentBrowserTimezone browser utility
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 5.
Depends on OTEL-A1 (package skeleton).

## Gap
Browser code needs a way to discover the user's IANA timezone without Node.js APIs.
We need a browser-compatible utility that reads the timezone from the browser environment.

## Scope
- `src/browser.ts`:
  - `getCurrentBrowserTimezone(): string` — returns the user's IANA timezone string using
    `Intl.DateTimeFormat().resolvedOptions().timeZone`. This is available in all modern
    browsers and Node.js >= 16.
  - Conditional export: this function should be exported via a browser-specific entry point
    (e.g., `@northguild/gmt-otel/browser`) so bundlers can tree-shake it out for server-side
    builds. Use package.json `"exports"` field with conditional exports.
- No OTel dependency needed — this is a pure browser utility.

## What gmt provides (do not re-implement)
- `zoned/validate` — `isValidTimeZone(tz)` can be used to validate the returned timezone
  if needed (though `Intl.DateTimeFormat().resolvedOptions().timeZone` always returns a
  valid IANA timezone string).

## Verification
- Returns a valid IANA timezone string in browser environments
- Conditional export works: bundlers can tree-shake for server-side builds
- No Node.js-specific APIs used (browser-compatible)
```

---

### OTEL-E2 — README, LICENSE, CI polish

**Title:**

```
OTEL-E2 Add README, LICENSE, final integration tests, and CI wiring
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 5.
Depends on all previous stories (A1-A4, B1-B2, C1-C2, D1-D2, E1).

## Gap
The package needs final polish before it can be published to npm.

## Scope
- `README.md`:
  - Package description: "GMT OTel — bridge between @northguild/gmt and OpenTelemetry"
  - Installation: `pnpm add @northguild/gmt-otel` (OTel is optional peer dep)
  - Quick start example showing timestamp conversion + span timezone helper
  - API reference linking to JSDoc
  - Browser usage note (conditional export)
- `LICENSE`: Copy from root (same license as gmt package).
- Integration tests:
  - End-to-end test showing full flow: parse ISO → convert to OTel timestamp → set on span → propagate timezone via baggage
  - Test that the package builds and passes all tests without OTel installed (optional peer dep)
- CI wiring:
  - Verify `pnpm nx run-many -t lint test typecheck build` works for the full workspace
  - Ensure changeset workflow works (every story should have a `.changeset/*.md`)
  - Verify npm publish would work (package.json fields, exports, etc.)

## Verification
- All tests pass
- `pnpm nx run-many -t lint test typecheck build` stays green for the full workspace
- README is clear and includes working examples
- Package is ready for npm publication
```
