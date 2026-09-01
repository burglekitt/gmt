# OTEL-B — Duration conversion

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

### OTEL-B1 — Duration conversion (`toOtelDuration` + `fromOtelDuration`)

**Title:**

```
OTEL-B1 Implement toOtelDuration and fromOtelDuration
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 2.
Depends on OTEL-A1 (package skeleton).

## Gap
OTel stores durations as nanosecond counts (number). gmt works with ISO 8601 duration
strings (e.g., `"PT1H30M"`). We need to bridge that gap.

## Scope
- `src/durations.ts`:
  - `toOtelDuration(durationString: string): number` — converts a gmt-style ISO 8601
    duration string (e.g., `"PT1H30M"`, `"P1DT2H"`) to nanoseconds as a number.
    Uses `@northguild/gmt/duration/calculate` internally: parse the duration string,
    then extract nanoseconds via Temporal.Duration's internal arithmetic.
  - `fromOtelDuration(nanoseconds: number): string` — converts OTel nanoseconds back to
    an ISO 8601 duration string.
- Both functions throw `RangeError` on invalid input.

## What gmt provides (do not re-implement)
- `duration/parse` — parses ISO 8601 duration strings into Temporal.Duration objects.
- `duration/format` — serializes Temporal.Duration back to ISO 8601 strings.
- `duration/calculate` — extracts numeric values from durations in various units.

## Verification
- Round-trip: `fromOtelDuration(toOtelDuration(dur)) === dur` for valid inputs
- Invalid input throws `RangeError`
- Edge cases: zero duration, sub-millisecond precision, multi-day durations
```

---

### OTEL-B2 — Duration conversion tests

**Title:**

```
OTEL-B2 Add comprehensive tests for duration conversion
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Phase 2.
Depends on OTEL-B1 (duration implementation).

## Gap
No tests exist yet for any gmt-otel function.

## Scope
- `test/durations.test.ts`:
  - Round-trip tests: `fromOtelDuration(toOtelDuration(dur)) === dur` for valid inputs
  - Invalid input throws `RangeError` (not sentinels — gmt-otel is a thin bridge)
  - Edge cases: zero duration, sub-millisecond precision, multi-day durations
  - ISO 8601 format variants: `"PT1H"`, `"P1DT2H"`, `"PT30M"`, etc.

## Verification
- All tests pass
- `pnpm nx run gmt-otel:test` covers all exported duration functions
```
