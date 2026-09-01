# Issue #146 — Context propagation: baggage and HTTP headers

**Re-audited 2026-09-01.** The original draft plan referenced OTel's `Context` type for
timezone propagation. In practice, OTel JS uses **Baggage** (W3C Baggage API) for
cross-service context propagation, not raw `Context`. This file uses the correct mechanism.
See [refined-plan.md](../refined-plan.md) for the full spec.

## Definition of done — binding for every story in this file

- `pnpm nx run-many -t lint test typecheck build` stays green.
- Changeset required — `@northguild/gmt-otel` is published to npm.
- Baggage functions gracefully degrade when `@opentelemetry/api` is not installed.
- No `Date` object anywhere.

---

### Issue #146 — OTEL-C1

**GitHub Issue:** #146

#### OTEL-C1a — Baggage-based timezone propagation

**Title:**

```
OTEL-C1a Implement baggage-based timezone propagation: setTimezoneInBaggage, getTimezoneFromBaggage
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 3.

## Gap
In distributed systems, the server timezone needs to propagate across service boundaries.
OTel JS uses the W3C Baggage API for this purpose. We provide helpers to set and read
timezone in baggage.

## Scope
Create `src/baggage.ts` with these functions:

### `setTimezoneInBaggage(timezone: string) => void`
Set the timezone in OTel Baggage.
- Uses `opentelemetry.propagation.setBaggage('gmt.timezone', { value: timezone })` from
  `@opentelemetry/api`
- Validates timezone using `isValidTimezone(timezone)` from gmt before setting
- Invalid timezone: throws `TypeError` with message "Invalid IANA timezone: ${timezone}"
- No return value

### `getTimezoneFromBaggage() => string | undefined`
Read the timezone from OTel Baggage.
- Uses `opentelemetry.propagation.getBaggage('gmt.timezone')` from `@opentelemetry/api`
- Returns the value as string, or `undefined` if not set
- Does NOT validate — returns whatever is stored in baggage

### `getTimezoneFromContext() => string | undefined`
Alias for `getTimezoneFromBaggage()`. Reads from the active context's baggage.
- Uses `opentelemetry.context.active()` internally
- Same behavior as `getTimezoneFromBaggage` but makes the intent explicit

## Tests (`test/baggage.test.ts`)
- `setTimezoneInBaggage('Europe/Helsinki')` stores the value in baggage
- `getTimezoneFromBaggage()` retrieves the stored value
- Round-trip: set → get returns the same value
- Invalid timezone throws descriptive error
- `getTimezoneFromContext()` returns the same value as `getTimezoneFromBaggage()`
- Graceful degradation: calling baggage functions without OTel installed throws a clear
  message

## Verification
- `pnpm nx run gmt-otel:test` passes all baggage tests
- `pnpm nx run gmt-otel:typecheck` passes
- Manual test: set timezone in baggage, verify it's accessible via active context

## Decisions
- We use the key `'gmt.timezone'` for the baggage item. This is namespaced to avoid
  collisions with other baggage items.
- Baggage has a 8KB total size limit per W3C spec. A single timezone string is ~20 bytes,
  so this is not a concern.
- We do NOT automatically extract timezone from the incoming request's `Accept-Timezone`
  header (if it exists). That would be a middleware concern, not a library concern.
```

---

#### OTEL-C1b — HTTP header propagation

**Title:**

```
OTEL-C1b Implement HTTP header propagation: propagateTimezone, extractTimezoneFromHeaders
```

**Description:**

```
Part of the gmt-otel epic — see `context/otel/index.md`, Tier 3.

## Gap
Baggage propagates context within OTel-instrumented services. For non-OTel services
(or as a fallback), we need HTTP header-based propagation.

## Scope
Create functions in `src/baggage.ts`:

### `propagateTimezone(headers: Record<string, string>, timezone: string) => void`
Inject timezone into HTTP headers for cross-service propagation.
- Sets `headers['X-GMT-Timezone'] = timezone`
- Validates timezone using `isValidTimezone(timezone)` from gmt before setting
- Invalid timezone: throws `TypeError` with message "Invalid IANA timezone: ${timezone}"
- Modifies headers object in place

### `extractTimezoneFromHeaders(headers: Record<string, string>) => string | undefined`
Extract timezone from HTTP headers.
- Reads `headers['X-GMT-Timezone']`
- Returns the value as string, or `undefined` if not present
- Does NOT validate — returns whatever is in the header

### `injectTimezoneIntoBaggageFromHeaders(headers: Record<string, string>) => void`
Convenience: extract timezone from headers and set it in baggage.
- Calls `extractTimezoneFromHeaders(headers)` then `setTimezoneInBaggage(result)`
- If no timezone in headers: no-op (does not throw)
- If invalid timezone in headers: throws `TypeError`

## Tests (`test/baggage.test.ts`)
- `propagateTimezone(headers, 'Europe/Helsinki')` sets `X-GMT-Timezone` header
- `extractTimezoneFromHeaders(headers)` retrieves the header value
- Round-trip: inject → extract returns the same value
- `injectTimezoneIntoBaggageFromHeaders(headers)` correctly bridges headers → baggage
- Invalid timezone in headers throws descriptive error
- Missing header returns undefined (no throw)

## Verification
- `pnpm nx run gmt-otel:test` passes all header tests
- `pnpm nx run gmt-otel:typecheck` passes

## Decisions
- We use the header name `X-GMT-Timezone`. This is a custom header, not a standard one.
  If the user wants a different header name, they can use `propagateTimezone` directly
  with a custom headers object.
- Header-based propagation is a fallback. The primary mechanism is OTel Baggage.
  In a full OTel-instrumented system, baggage propagates automatically via the
  TextMapPropagator. Header injection is for non-OTel services or debugging.
```
