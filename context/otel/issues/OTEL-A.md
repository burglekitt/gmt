# Issue #143–#144 — Core: package skeleton, timestamp conversion, timezone intelligence

**Re-audited 2026-09-01.** The original draft plan (now at [overview.md](overview.md)) was
heavily hallucinated — it invented `GMTDate` types, assumed gmt had methods like
`GMTDate.now()` and `toUTC()`, and claimed "zero dependencies on OTel." This file
corrects every hallucination. Every function maps to an existing gmt API. See
[refined-plan.md](../refined-plan.md) for the full corrected spec.

Each issue below is one logical unit; its sub-stories are nested under it and ordered as
they should be built. The issue stays open until its last sub-story lands.

## Definition of done — binding for every story in this file

- `pnpm nx run-many -t lint test typecheck build` stays green, **including the 20-cell
  GMT timezone matrix**. `packages/gmt-otel` must not perturb `packages/gmt`.
- Changesets required — `@northguild/gmt-otel` is published to npm.
- No `Date` object anywhere. All inputs are ISO 8601 strings; outputs are strings, numbers,
  booleans, or arrays.
- Wrap all Temporal calls in `try-catch`. Bad input returns sentinels, never throws.

---

### Issue #143 — OTEL-A1

**GitHub Issue:** #143

#### OTEL-A1a — Package skeleton + CI wiring

**Title:**

```
OTEL-A1a Create packages/gmt-otel workspace package with pnpm/nx/oxlint wiring
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 0.

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
- Add root scripts `otel:dev` (alias for `otel:build --watch`) and `otel:build`.

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
  runtime and throw a descriptive error if called without it.
```

---

#### OTEL-A1b — Timestamp conversion (Tier 0 core)

**Title:**

```
OTEL-A1b Implement timestamp conversion: toOtelTimestamp, fromOtelTimestamp, unix↔zoned bridges
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 0.

## Gap
OTel uses nanosecond-precision timestamps as `[seconds, nanoseconds]` tuples (`TimeInput`).
gmt works with ISO 8601 strings. We need bidirectional conversion.

## Scope
Create `src/timestamps.ts` with these functions:

### `toOtelTimestamp(zdt: string) => [number, number]`
Convert a ZonedDateTime ISO string to OTel's `[seconds, nanoseconds]` tuple.
- Uses `convertZonedToUnix(zdt)` from `gmt/zoned/convert` for seconds
- Extracts nanosecond field via `getZonedNanosecond(zdt)` from `gmt/zoned/get`
- Returns `[Number(unixSeconds), getZonedNanosecond(zdt)]`
- Invalid input: returns `null`

### `fromOtelTimestamp(tuple: [number, number], tz?: string) => string`
Convert an OTel `[seconds, nanoseconds]` tuple to an ISO 8601 string.
- If `tz` is provided: build Unix timestamp string, then `convertUnixToZoned(ts, tz)` from
  `gmt/unix/convert`
- If `tz` is omitted: build Unix timestamp string, then `convertUnixToUtc(ts)` from
  `gmt/unix/convert` (returns UTC datetime string)
- Nanoseconds are appended to the ISO string as fractional seconds
- Invalid input: returns `""`

### `toOtelTimeInput(zdt: string) => [number, number]`
Alias for `toOtelTimestamp`. OTel's `TimeInput` IS `[seconds, nanoseconds]`.

### `fromOtelTimeInput(tuple: [number, number], tz?: string) => string`
Alias for `fromOtelTimestamp`.

### `zdtToUnix(zdt: string) => string`
Direct re-export wrapper around `convertZonedToUnix` from `gmt/zoned/convert`.
- Invalid input: returns `""`

### `unixToZoned(ts: string, tz: string) => string`
Direct re-export wrapper around `convertUnixToZoned` from `gmt/unix/convert`.
- Invalid input: returns `""`

### `utcToUnix(dt: string) => string`
Direct re-export wrapper around `convertUtcToUnix` from `gmt/utc/convert`.
- Invalid input: returns `""`

### `unixToUtc(ts: string) => string`
Direct re-export wrapper around `convertUnixToUtc` from `gmt/unix/convert`.
- Invalid input: returns `""`

## Barrel export
Export all functions from `src/index.ts`.

## Tests (`test/timestamps.test.ts`)
- Valid ZonedDateTime → `[seconds, nanoseconds]` round-trips correctly
- `[seconds, nanoseconds]` → ZonedDateTime round-trips correctly (within 1 second tolerance
  for seconds component)
- UTC conversion: `zdtToUnix(utcToUnix(zdt))` equals `zdtToUnix(zdt)`
- Invalid inputs return sentinels (`null` for tuple returns, `""` for string returns)
- Nanosecond precision preserved through round-trip
- Edge cases: epoch, year 2038 boundary, leap second handling

## Verification
- `pnpm nx run gmt-otel:test` passes all timestamp tests
- `pnpm nx run gmt-otel:typecheck` passes
- Manual check: `toOtelTimestamp("2024-06-01T15:00:00+03:00[Europe/Helsinki]")` returns
  correct `[seconds, nanoseconds]` tuple

## Decisions
- No custom types needed. OTel's `TimeInput` is just `[number, number]`. We use that
  directly — no wrapper type.
- Nanosecond precision: gmt's `getZonedNanosecond()` returns 0–999999999. We use it
  directly as the nanoseconds component. Millisecond precision is available via
  `getZonedMillisecond()` if needed for simpler cases.
```

---

### Issue #144 — OTEL-A2

**GitHub Issue:** #144

#### OTEL-A2a — Timezone intelligence

**Title:**

```
OTEL-A2a Implement timezone intelligence: getServerTimezone, isInDst, dstTransitions, etc.
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 1.

## Gap
Observability systems need timezone context: what timezone is the server in? Is this
timestamp in DST? When do DST transitions happen? gmt has all these functions but they
need to be re-exported with consistent error handling and OTel-specific wrappers.

## Scope
Create `src/timezones.ts` with these functions:

### `getServerTimezone() => string`
Re-export of `getSystemTimeZone()` from `gmt/zoned/get`.
- Returns the IANA timezone identifier for the current system
- Invalid/unsupported: returns `""`

### `getTimezoneOffset(tz: string, zdt: string) => number`
Re-export of `getTimeZoneOffset(tz, zdt)` from `gmt/zoned/get`.
- Returns UTC offset in seconds at the given zoned datetime
- Invalid input: returns `null`

### `isInDst(zdt: string) => boolean`
Re-export of `isInDaylightSaving(zdt)` from `gmt/zoned/compare`.
- Invalid input: returns `false`

### `getDstTransitions(tz: string, year: number) => { start: string, end: string }[]`
Wrapper around `getDstTransitions(tz, year)` from `gmt/zoned/get`.
- Returns array of DST transition objects with ISO 8601 strings
- Empty array if timezone has no DST or input is invalid
- Invalid input: returns `[]`

### `formatTimezoneName(tz: string) => string`
Re-export of `formatTimeZoneName(tz)` from `gmt/zoned/format`.
- Returns display name (e.g., "Eastern European Summer Time")
- Invalid input: returns `""`

### `listTimezones() => string[]`
Re-export of `getTimeZones()` from `gmt/zoned/get`.
- Returns all IANA timezone identifiers
- Never fails (returns cached list)

### `isValidTimezone(tz: string) => boolean`
Re-export of `isValidTimeZone(tz)` from `gmt/zoned/validate`.
- Invalid input: returns `false`

## Tests (`test/timezones.test.ts`)
- `getServerTimezone()` returns a valid IANA identifier
- `isInDst()` correctly identifies DST/non-DST timestamps for known timezones
- `getDstTransitions()` returns correct transition dates for US/EU timezones
- `formatTimezoneName()` returns human-readable names
- `isValidTimezone()` rejects invalid identifiers, accepts valid ones
- Invalid inputs return sentinels (never throw)

## Verification
- `pnpm nx run gmt-otel:test` passes all timezone tests
- `pnpm nx run gmt-otel:typecheck` passes

## Decisions
- No locale matrix needed — timezone output is not locale-dependent.
- DST transitions are timezone-specific, not locale-specific.
```

---

#### OTEL-A2b — Duration conversion

**Title:**

```
OTEL-A2b Implement duration conversion: durationToNanoseconds, spanDurationMs
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 1.

## Gap
OTel spans have start/end times; computing their duration in milliseconds is a common
operation. gmt has duration functions but they work with ISO 8601 duration strings, not
timestamp pairs.

## Scope
Create `src/durations.ts` with these functions:

### `durationToNanoseconds(duration: string) => number`
Convert an ISO 8601 duration string to nanoseconds as a number.
- Uses `durationAs(dur, 'nanosecond')` from `gmt/duration/calculate`
- Invalid input: returns `null`

### `nanosecondsToDuration(ns: number) => string`
Convert a nanosecond count to an ISO 8601 duration string.
- Builds the ISO duration string manually (no gmt function does this directly)
- Handles negative values with leading `-`
- Invalid input (non-finite): returns `""`

### `spanDurationMs(startZdt: string, endZdt: string) => number`
Compute the duration in milliseconds between two zoned datetimes.
- Uses `diffZoned(startZdt, endZdt)` from `gmt/zoned/calculate` with unit `'millisecond'`
- Returns absolute value (always positive)
- Invalid input: returns `null`

## Tests (`test/durations.test.ts`)
- `durationToNanoseconds("PT1S")` returns `1000000000`
- `nanosecondsToDuration(1000000000)` returns `"PT1S"`
- `spanDurationMs()` correctly computes duration across DST transitions
- Invalid inputs return sentinels

## Verification
- `pnpm nx run gmt-otel:test` passes all duration tests
- `pnpm nx run gmt-otel:typecheck` passes

## Decisions
- `nanosecondsToDuration` is the only function that doesn't directly re-export a gmt
  function — it builds an ISO 8601 duration string from a number. This is straightforward
  arithmetic (ns → s/ms/us/ns components → P[nY][nM][nW][nDTnHnMnS] format).
```
