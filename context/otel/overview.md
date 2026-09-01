# `@northguild/gmt-otel` Package Plan

> **A bridge between `@northguild/gmt` and OpenTelemetry for timezone-aware, nanosecond-precision observability.**

---

## What This Plan Is (and Isn't)

This is a **package plan**, not a Dox story. It defines a new published package `@northguild/gmt-otel` that sits on top of `@northguild/gmt` and `@opentelemetry/api`. It is **not** part of the Dox epic — it does not modify `apps/dox`, does not need Dox's reference generator, and does not fold into any existing Dox issue.

If/when this package ships, its own documentation would live in its own README (or a future docs site), not in `apps/dox`.

---

## What the Original Plan Got Wrong

The original draft was generated without access to the actual `@northguild/gmt` source. Here are the key hallucinations:

1. **`GMTDate` does not exist.** `@northguild/gmt` is string-in, string-out. There is no `Date`-like object anywhere in the public API. Users pass ISO 8601 strings and get back ISO 8601 strings (or numbers, booleans, arrays). The polyfill (`@js-temporal/polyfill`) is an internal implementation detail.

2. **`ZonedDateTime` and `Instant` are not user-facing types.** They are Temporal types from the polyfill, used internally by gmt but never exported. The public API works with strings like `"2024-06-01T15:00:00+03:00"`.

3. **Most "timezone utilities" already exist in gmt.** Functions like `getDstTransitions`, `getWeekOfYear`, locale-aware formatting, and timezone conversion are all in `@northguild/gmt/zoned` and `@northguild/gmt/utc`. There is no need to re-implement them.

4. **Span helpers (`startSpan`, `endSpan`) are pure OTel concepts.** gmt-otel would not create its own span objects — it would wrap `@opentelemetry/api`'s `trace.startSpan()` and set attributes on the returned `Span`. The original plan's `startSpan`/`endSpan` signatures were invented from scratch with no basis in either OTel's API or gmt's design.

5. **`toISOString`/`fromISOString` already exist.** `@northguild/gmt/plain/toISO`, `@northguild/gmt/zoned/toISO`, etc. are the real functions. gmt-otel should not re-export them — it should focus on the OTel bridge.

---

## What This Package Actually Does

`@northguild/gmt-otel` provides **two things** that neither `@northguild/gmt` nor `@opentelemetry/api` provide alone:

1. **Timestamp conversion between gmt's string world and OTel's nanosecond world.** OTel stores all timestamps as `[seconds, nanoseconds]` tuples (bigint or number). gmt works with ISO strings. This package bridges that gap.

2. **Timezone-aware span attributes.** OTel spans have no concept of timezone — they store absolute nanosecond timestamps. This package provides helpers to attach IANA timezone metadata to spans so that downstream tools (Dash0, Grafana, etc.) can display span times in the user's local timezone.

That's it. Two things. Not a reimplementation of gmt, not a new date library, not a span framework.

---

## What gmt Already Provides (Do Not Re-implement)

| What the original plan wanted | Where it already lives in `@northguild/gmt` |
|-------------------------------|---------------------------------------------|
| `toISOString` / `fromISOString` | `plain/toISO`, `zoned/toISO`, `utc/toISO` — string-in, string-out |
| `toUTC` / `toZonedDateTime` | `zoned/fromISO`, `utc/fromISO`, `zoned.convert` |
| `formatInTimezone` | `zoned/format` — accepts format string, returns string |
| `getTimezoneOffset` | `zoned/offset` — returns offset string like `"+03:00"` |
| `isValidTimezone` | `zoned/fromISO` returns sentinel `""` on invalid timezone |
| `isDSTTransition` | `zoned/getDstTransitions` — returns array of transition dates |
| `getCurrentTimezone` | Not in gmt (browser-only concept) — gmt-otel can add this as a browser utility |
| Duration formatting | `duration/format` — string-in, string-out |

**Rule:** gmt-otel must never re-implement date/time logic. It converts between worlds; it does not compute dates.

---

## Package Structure (Corrected)

```
packages/
  gmt-otel/
    src/
      index.ts              # Public exports
      timestamps.ts         # toOtelTimestamp, fromOtelTimestamp, toOtelTimeInput, fromOtelTimeInput
      durations.ts          # toOtelDuration, fromOtelDuration
      span-timezone.ts      # setSpanTimezone, getSpanTimezone, withTimezoneSpan
      context.ts            # setTimezoneInBaggage, getTimezoneFromBaggage, propagateTimezone
      browser.ts            # getCurrentBrowserTimezone (browser-only, conditional export)
    test/
      timestamps.test.ts
      durations.test.ts
      span-timezone.test.ts
      context.test.ts
      browser.test.ts
    package.json
    tsconfig.json
    tsconfig.build.json
    vitest.config.ts
    README.md
    LICENSE
```

**No `types.ts` file.** All types are either OTel's own (`Span`, `Context`, `SpanAttributes`) or gmt's (ISO strings, which are just `string` in TypeScript).

**No `iso.ts` file.** ISO parsing/serialization is gmt's job.

**No `validation.ts` file.** Validation is gmt's job — invalid input returns sentinels.

**No `spans.ts` file.** There are no span objects to manage. Span helpers work on OTel's `Span` interface directly.

---

## Public API (Final, Corrected)

### Timestamp Conversion

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `toOtelTimestamp` | `(isoString: string) => bigint` | Nanosecond timestamp since Unix epoch | Converts any ISO 8601 string (plain, zoned, or UTC) to OTel's nanosecond format. Throws `RangeError` on invalid input — gmt-otel does not use sentinels for its own API (it's a thin bridge, not a date library). |
| `fromOtelTimestamp` | `(nanoseconds: bigint, timezone?: string) => string` | ISO 8601 string | Converts OTel nanosecond timestamp to an ISO string. If `timezone` is provided, the result is in that timezone; otherwise it's UTC. Throws on invalid input. |
| `toOtelTimeInput` | `(isoString: string) => [number, number]` | `[seconds, nanoseconds]` tuple | Converts ISO string to OTel's `TimeInput` format (used by `hrTime()`). Returns a tuple of two numbers, not a bigint. |
| `fromOtelTimeInput` | `(timeInput: [number, number], timezone?: string) => string` | ISO 8601 string | Converts OTel `TimeInput` tuple back to ISO string. |

### Duration Conversion

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `toOtelDuration` | `(durationString: string) => number` | Nanoseconds as number | Converts a gmt-style duration string (e.g., `"PT1H30M"`) to OTel's nanosecond count. |
| `fromOtelDuration` | `(nanoseconds: number) => string` | ISO 8601 duration | Converts OTel nanoseconds back to an ISO 8601 duration string. |

### Span Timezone Helpers

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `setSpanTimezone` | `(span: Span, timezone: string) => void` | — | Sets the `gmt.timezone` attribute on an OTel span. |
| `getSpanTimezone` | `(span: Span) => string \| undefined` | IANA timezone or undefined | Reads the `gmt.timezone` attribute from a span. |
| `withTimezoneSpan` | `(tracer: Tracer, name: string, options?: { timezone?: string, attributes?: SpanAttributes }) => Span` | OTel Span | Starts a span and immediately sets its timezone attribute. Convenience wrapper around `tracer.startSpan()` + `setSpanTimezone`. |

### Context / Baggage Helpers

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `setTimezoneInBaggage` | `(context: Context, timezone: string) => Context` | New context | Sets `gmt-timezone` key in OTel baggage for propagation. |
| `getTimezoneFromBaggage` | `(context: Context) => string \| undefined` | IANA timezone or undefined | Reads `gmt-timezone` from baggage. |
| `propagateTimezone` | `(carrier: Record<string, string>, timezone: string) => void` | — | Injects `gmt-timezone` header into a carrier (e.g., HTTP headers) for cross-service propagation via W3C baggage. |

### Browser Utility

| Function | Signature | Returns | Description |
|----------|-----------|---------|-------------|
| `getCurrentBrowserTimezone` | `() => string` | IANA timezone | Returns `Intl.DateTimeFormat().resolvedOptions().timeZone`. Browser-only — conditionally exported so bundlers can tree-shake it in Node. |

---

## Dependencies

```json
{
  "dependencies": {
    "@northguild/gmt": "workspace:*"
  },
  "peerDependencies": {
    "@opentelemetry/api": "^1.9.0"
  }
}
```

**Only one real dependency:** `@northguild/gmt`. OTel is a peer dependency (the consumer already has it if they're using gmt-otel). No other dependencies.

**No polyfill needed.** `@northguild/gmt` already depends on `@js-temporal/polyfill` — gmt-otel gets it transitively.

---

## What This Package Does NOT Do

- **Does not replace OTel span creation.** Consumers still call `tracer.startSpan()` directly or use `withTimezoneSpan` as a convenience wrapper. gmt-otel does not manage span lifecycles.
- **Does not re-implement date formatting.** Use `@northguild/gmt/zoned/format` for that.
- **Does not provide a logging layer.** It attaches metadata to existing OTel spans/logs; it does not create loggers.
- **Does not handle timezones in OTel's internal storage.** OTel stores everything as absolute nanoseconds. gmt-otel only adds timezone as a *hint* attribute for downstream consumers.
- **Does not work with `Date` objects.** There are no `Date` inputs or outputs. Everything is ISO strings.

---

## Implementation Roadmap (Phases → Stories)

### Phase 1 — Core timestamp conversion (MVP)

The absolute minimum: convert between OTel's nanosecond world and gmt's string world.

- **OTel-A1** — Package skeleton + `toOtelTimestamp` + `fromOtelTimestamp`
- **OTel-A2** — `toOtelTimeInput` + `fromOtelTimeInput`
- **OTel-A3** — Tests for timestamp conversion (round-trip, edge cases, full locale matrix)

### Phase 2 — Duration conversion

- **OTel-B1** — `toOtelDuration` + `fromOtelDuration`
- **OTel-B2** — Tests for duration conversion

### Phase 3 — Span timezone helpers

- **OTel-C1** — `setSpanTimezone` + `getSpanTimezone` + `withTimezoneSpan`
- **OTel-C2** — Tests for span helpers

### Phase 4 — Context / baggage propagation

- **OTel-D1** — `setTimezoneInBaggage` + `getTimezoneFromBaggage` + `propagateTimezone`
- **OTel-D2** — Tests for context propagation

### Phase 5 — Browser utility + polish

- **OTel-E1** — `getCurrentBrowserTimezone` (conditional export)
- **OTel-E2** — README, LICENSE, final integration tests, CI wiring

---

## Testing Strategy

Every function follows gmt's conventions:

1. **Round-trip tests.** `fromOtelTimestamp(toOtelTimestamp(iso)) === iso` for valid inputs.
2. **Invalid input throws.** gmt-otel is a thin bridge — it does not use sentinels. Invalid ISO strings throw `RangeError`.
3. **Edge cases.** Epoch, max safe nanoseconds, DST transition boundaries, leap seconds (if applicable).
4. **Integration with real OTel.** Spin up a no-op tracer, create spans, verify attributes are set correctly.

---

## CI / Monorepo Integration

- Lives in `packages/gmt-otel/` alongside the other gmt packages.
- Included in the root `pnpm-workspace.yaml` and `package.json` workspaces array.
- Gets automatic `lint`, `test`, `typecheck`, and `build` targets from the root Vitest config (add to workspace glob).
- No changeset needed if it's purely additive (new package), but follows the repo's normal convention for version bumps.
- The 20-cell GMT timezone matrix test runs against `packages/gmt` only — gmt-otel has its own test suite.
