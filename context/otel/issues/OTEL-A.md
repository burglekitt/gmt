# OTEL-A — Package skeleton + timestamp conversion

**Audited 2026-09-01.** All functions map to existing gmt APIs. No `GMTDate`, no invented types, no reimplementation of date logic. See [overview.md](../overview.md) for the full corrected spec.

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
- Full IANA timezone coverage for timezone-aware functions (not locale matrix — gmt-otel
  output is not locale-dependent).

---

### OTEL-A1 — Package skeleton + CI wiring

**Title:**

```
OTEL-A1 Create packages/gmt-otel workspace package with pnpm/nx/oxlint wiring
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 1.

## Gap
`packages/gmt-otel` does not exist. We need a workspace package that depends on
`@northguild/gmt` and optionally peers on `@opentelemetry/api`.

## Scope
- Create `packages/gmt-otel` as `@northguild/gmt-otel` (`"type": "module"`).
- `package.json`:
  - `"dependencies": { "@northguild/gmt": "workspace:*" }`
  - `"peerDependencies": { "@opentelemetry/api": "^1.9 || ^1.10" }`
  - `"peerDependenciesMeta": { "@opentelemetry/api": { "optional": true } }`
  - `"devDependencies"` includes `@opentelemetry/api` (for type checking/tests),
    `typescript`, `vitest`
  - `"engines": { "node": ">=22.12.0" }` (same as gmt)
- `tsconfig.json` extending `../../tsconfig.base.json` (standard for workspace packages).
- `tsconfig.build.json` for the build output.
- `vitest.config.ts` following the repo pattern.
- `project.json` — **required.** Nx's `@nx/js/typescript` plugin infers build/typecheck
  from `tsconfig.build.json`. Declare `build`, `test`, `typecheck`, and `lint` with
  `dependsOn: ["^build"]` so `@northguild/gmt` builds first.
- Add `packages/gmt-otel/dist` to `.gitignore`.
- Update root `pnpm-workspace.yaml` — add `packages/gmt-otel` if not already in the
  `packages/*` glob (it should be, but verify).
- Update root `package.json` — verify `packages/*` glob covers it.
- Update `oxlint.config.js` — add `packages/gmt-otel` to the include glob; add
  `packages/gmt-otel/dist` to ignore.

## Before starting
Verify that `pnpm-workspace.yaml` already covers `packages/*` via glob. If the workspace
uses explicit entries instead, add `packages/gmt-otel`. Check that root `package.json`
scripts don't need updating.

## Verification
- `pnpm install` succeeds
- `pnpm nx run gmt-otel:typecheck` runs (even with empty src)
- `pnpm nx run gmt-otel:build` produces output directory
- `pnpm nx run-many -t lint test typecheck build` stays green

## Decisions
- OTel API is an **optional peer dependency**. The package must build and pass tests
  without OTel installed. Span/baggage functions check for `@opentelemetry/api` at
  runtime and throw a clear `TypeError` if not found (rather than silently failing).
```

---

### OTEL-A2 — Timestamp conversion (`toOtelTimestamp` + `fromOtelTimestamp`)

**Title:**

```
OTEL-A2 Implement toOtelTimestamp and fromOtelTimestamp
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 1.
Depends on OTEL-A1 (package skeleton).

## Gap
OTel stores timestamps as `[seconds, nanoseconds]` tuples. gmt works with ISO 8601 strings.
We need to bridge that gap.

## Scope
- `src/timestamps.ts`:
  - `toOtelTimestamp(isoString: string): bigint` — converts any ISO 8601 string (plain,
    zoned, or UTC) to nanoseconds since Unix epoch. Uses `@northguild/gmt/zoned/convert`
    internally: parse the input via `zoned/fromISO` (which handles all three formats),
    then convert to nanoseconds using Temporal's internal arithmetic.
  - `fromOtelTimestamp(nanoseconds: bigint, timezone?: string): string` — converts OTel
    nanosecond timestamp to an ISO string. If `timezone` is provided, the result is in
    that timezone; otherwise it's UTC.
- Both functions throw `RangeError` on invalid input — gmt-otel does not use sentinels
  for its own API (it's a thin bridge, not a date library).

## What gmt provides (do not re-implement)
- `zoned/fromISO` — parses ISO 8601 strings into Temporal.ZonedDateTime (handles plain,
  zoned, and UTC inputs). Returns sentinel `""` on invalid input.
- `utc/fromISO` — parses UTC datetime strings.
- `plain/toISO` / `zoned/toISO` / `utc/toISO` — serialize back to ISO strings.

## Verification
- Round-trip: `fromOtelTimestamp(toOtelTimestamp(iso), tz) === iso` for valid inputs
- Invalid input throws `RangeError`
- Edge cases: epoch (0), max safe nanoseconds, DST transition boundaries
```

---

### OTEL-A3 — TimeInput conversion (`toOtelTimeInput` + `fromOtelTimeInput`)

**Title:**

```
OTEL-A3 Implement toOtelTimeInput and fromOtelTimeInput
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 1.
Depends on OTEL-A2 (timestamp conversion).

## Gap
OTel's `hrTime()` API uses `[seconds, nanoseconds]` tuples (called `TimeInput` in OTel's
type system). This is the same shape as nanosecond timestamps but used in a different
context — we need explicit wrappers for this pattern.

## Scope
- `src/timestamps.ts`:
  - `toOtelTimeInput(isoString: string): [number, number]` — converts ISO string to OTel's
    `TimeInput` format. Returns a tuple of two numbers (seconds, nanoseconds).
  - `fromOtelTimeInput(timeInput: [number, number], timezone?: string): string` — converts
    OTel `TimeInput` tuple back to ISO string.
- These are thin wrappers around the bigint versions in OTEL-A2 — convert to/from bigint
  internally.

## Verification
- Round-trip: `fromOtelTimeInput(toOtelTimeInput(iso), tz) === iso` for valid inputs
- Invalid input throws `RangeError`
- Tuple structure is correct: `[seconds, nanoseconds]` where nanoseconds < 1_000_000_000
```

---

### OTEL-A4 — Timestamp conversion tests

**Title:**

```
OTEL-A4 Add comprehensive tests for timestamp and TimeInput conversion
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 1.
Depends on OTEL-A2 and OTEL-A3 (timestamp + TimeInput implementation).

## Gap
No tests exist yet for any gmt-otel function.

## Scope
- `test/timestamps.test.ts`:
  - Round-trip tests: `fromOtelTimestamp(toOtelTimestamp(iso)) === iso` for valid inputs
  - Round-trip tests: `fromOtelTimeInput(toOtelTimeInput(iso)) === iso` for valid inputs
  - Invalid input throws `RangeError` (not sentinels — gmt-otel is a thin bridge)
  - Edge cases: epoch (0), max safe nanoseconds, DST transition boundaries
  - Timezone variants: UTC, offset timezones, IANA timezones with DST
  - TimeInput tuple validation: nanoseconds < 1_000_000_000

## Verification
- All tests pass
- `pnpm nx run gmt-otel:test` covers all exported timestamp functions
```
