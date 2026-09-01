# Issue #145 — Span integration: timezone-aware span helpers

**Re-audited 2026-09-01.** The original draft plan invented `startSpan`/`endSpan` as if
gmt had a span API. It doesn't. These functions wrap OTel's `Span` API, using gmt for
timestamp conversion. See [refined-plan.md](../refined-plan.md) for the full spec.

## Definition of done — binding for every story in this file

- `pnpm nx run-many -t lint test typecheck build` stays green.
- Changeset required — `@northguild/gmt-otel` is published to npm.
- Span functions gracefully degrade when `@opentelemetry/api` is not installed: they
  throw a descriptive error message, not a cryptic import failure.
- No `Date` object anywhere. All timestamp inputs are ISO 8601 strings.

---

### Issue #145 — OTEL-B1

**GitHub Issue:** #145

#### OTEL-B1a — Span timezone attributes

**Title:**

```
OTEL-B1a Implement span timezone attributes: setSpanTimezone, getSpanTimezone
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 2.

## Gap
OTel spans have no built-in timezone concept. They store timestamps as nanosecond tuples
but don't track which timezone a span was created in. We add this via semantic attributes.

## Scope
Create `src/spans.ts` with these functions:

### `setSpanTimezone(span: Span, tz: string) => void`
Set the timezone as a span attribute.
- Sets `span.setAttribute('gmt.timezone', tz)` from `@opentelemetry/api`
- Validates timezone using `isValidTimezone(tz)` from gmt before setting
- Invalid timezone: throws `TypeError` with message "Invalid IANA timezone: ${tz}"
- No return value

### `getSpanTimezone(span: Span) => string | undefined`
Read the timezone from a span's attributes.
- Returns `span.attributes.get('gmt.timezone')` as string, or `undefined` if not set
- Does NOT validate — returns whatever is stored

### `setSpanStartZoned(span: Span, zdt: string) => void`
Set a span's start time from a ZonedDateTime string.
- Converts zdt → OTel TimeInput using `toOtelTimestamp(zdt)` from gmt-otel
- Calls `span.startTime = [seconds, nanoseconds]` (OTel's internal property)
- Invalid zdt: throws `TypeError` with message "Invalid zoned datetime: ${zdt}"

### `setSpanEndZoned(span: Span, zdt: string) => void`
Set a span's end time from a ZonedDateTime string.
- Converts zdt → OTel TimeInput using `toOtelTimestamp(zdt)` from gmt-otel
- Calls `span.endTime = [seconds, nanoseconds]` (OTel's internal property)
- Invalid zdt: throws `TypeError` with message "Invalid zoned datetime: ${zdt}"

### `getSpanDurationMs(span: Span) => number | null`
Compute the duration of a span in milliseconds.
- Reads `span.startTime` and `span.endTime` from OTel's TimeInput tuples
- Converts to ISO strings via gmt-otel's `fromOtelTimestamp`, then uses `spanDurationMs`
- Returns `null` if start/end times are not set or conversion fails

## Tests (`test/spans.test.ts`)
- `setSpanTimezone` / `getSpanTimezone` round-trip correctly
- Invalid timezone throws descriptive error
- `setSpanStartZoned` / `setSpanEndZoned` correctly set OTel span properties
- `getSpanDurationMs` returns correct millisecond difference
- Graceful degradation: calling span functions without OTel installed throws a clear
  message: "OTel API not installed. Install @opentelemetry/api to use span helpers."

## Verification
- `pnpm nx run gmt-otel:test` passes all span tests
- `pnpm nx run gmt-otel:typecheck` passes
- Manual test: create a span with `@opentelemetry/api`, set timezone, verify attribute
  is stored and retrievable

## Decisions
- We use OTel's `span.startTime` / `span.endTime` internal properties directly. These
  are not part of the public Span API but are the standard way to set custom start/end
  times in OTel JS SDK. If this changes in a future OTel version, we'll need a shim.
- Timezone validation happens at set-time, not at read-time. This prevents storing
  invalid timezone strings on spans.
```

---

#### OTEL-B1b — Span factory

**Title:**

```
OTEL-B1b Implement createZonedSpan: span factory with timezone and explicit start time
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 2.

## Gap
Creating a span with an explicit start time (e.g., for recording historical events)
requires boilerplate: create span, set timezone attribute, set start time. We provide
a single factory function.

## Scope
Create `createZonedSpan` in `src/spans.ts`:

### `createZonedSpan(tracer: Tracer, name: string, options?: { zdt?: string, tz?: string }) => Span`
Factory that creates a span with optional explicit start time and timezone attribute.

Parameters:
- `tracer`: OTel Tracer instance from `tracer = opentelemetry.trace.getTracer('gmt-otel')`
- `name`: Span name (standard OTel)
- `options.zdt`: Optional ZonedDateTime string for explicit start time
- `options.tz`: Optional IANA timezone identifier

Behavior:
1. Creates span via `tracer.startSpan(name, { startTime: zdt ? toOtelTimestamp(zdt) : undefined })`
2. If `tz` is provided, calls `setSpanTimezone(span, tz)`
3. Returns the span

Invalid inputs:
- Invalid zdt: throws `TypeError`
- Invalid tz: throws `TypeError`
- No OTel API installed: throws descriptive error

## Tests (`test/spans.test.ts`)
- `createZonedSpan(tracer, 'test-span')` creates a span with no timezone
- `createZonedSpan(tracer, 'test-span', { tz: 'Europe/Helsinki' })` sets timezone attribute
- `createZonedSpan(tracer, 'test-span', { zdt: '2024-06-01T15:00:00+03:00[Europe/Helsinki]' })`
  sets explicit start time
- Combined: both zdt and tz work together
- Invalid inputs throw descriptive errors

## Verification
- `pnpm nx run gmt-otel:test` passes all factory tests
- `pnpm nx run gmt-otel:typecheck` passes

## Decisions
- This is a thin wrapper around OTel's `tracer.startSpan()`. It doesn't replace the
  full OTel span lifecycle (begin, end, recordException) — users still call `span.end()`
  themselves.
- The factory does NOT automatically set the timezone from the zdt string's embedded
  timezone. If the user passes a zdt with `[Europe/Helsinki]` but also passes `tz: 'America/New_York'`,
  both are set (the tz attribute overrides for display purposes). This is intentional:
  the zdt controls the timestamp, the tz attribute controls the display context.
```
