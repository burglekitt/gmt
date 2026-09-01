# gmt-otel — Tracker

> **`@northguild/gmt-otel`** bridges `@northguild/gmt` and OpenTelemetry for timezone-aware,
> nanosecond-precision observability. All functions map to existing gmt APIs — nothing is
> invented from thin air. See [overview.md](overview.md) for the full spec.

---

## Overview

The original draft plan (now at [overview.md](overview.md)) was heavily hallucinated: it
invented `GMTDate` types that don't exist, assumed gmt had methods like `GMTDate.now()`
and `toUTC()`, and claimed "zero dependencies on OTel" when the package's entire value is
integrating with `@opentelemetry/api`.

The refined plan ([overview.md](overview.md)) corrects every hallucination. Every
function in the new package maps to an existing gmt API. The package has two dependency
tiers:

- **Required:** `@northguild/gmt` (workspace dependency)
- **Optional peer:** `@opentelemetry/api` — timestamp/timezone/duration tiers work with
  just gmt; span/baggage tiers require OTel at runtime

## Stories

The 5 phases map onto 12 fully independent stories. Each story is its own unit of work
with its own deliverable — no sub-stories, no nesting.

| Order | Story          | Phase              | Status      |
| ----- | -------------- | ------------------ | ----------- |
| 1     | OTEL-A1        | Package skeleton   | Not started |
| 2     | OTEL-A2        | Timestamp conversion | Not started |
| 3     | OTEL-A3        | TimeInput conversion | Not started |
| 4     | OTEL-A4        | Timestamp tests    | Not started |
| 5     | OTEL-B1        | Duration conversion | Not started |
| 6     | OTEL-B2        | Duration tests     | Not started |
| 7     | OTEL-C1        | Span timezone helpers | Not started |
| 8     | OTEL-C2        | Span tests         | Not started |
| 9     | OTEL-D1        | Context/baggage propagation | Not started |
| 10    | OTEL-D2        | Context tests      | Not started |
| 11    | OTEL-E1        | Browser utility    | Not started |
| 12    | OTEL-E2        | README, LICENSE, CI polish | Not started |

**Each story is independent.** A story closes when its deliverable lands and passes CI.

## Build Order

- **OTEL-A1 is the foundation.** Package skeleton must exist before anything else.
- **OTEL-A2 → OTEL-A3 are order-locked.** Timestamp conversion is the core value — everything
  else depends on it. Build A2 → A3 in sequence.
- **OTEL-A4 may start after OTEL-A3 lands.** Tests validate the timestamp tier.
- **OTEL-B1 may start after OTEL-A2 lands.** Duration conversion is independent of TimeInput
  but both depend on the package skeleton from OTEL-A1.
- **OTEL-B2 may start after OTEL-B1 lands.**
- **OTEL-C1 may start after OTEL-A2 lands.** Span helpers use timestamp conversion.
- **OTEL-C2 may start after OTEL-C1 lands.**
- **OTEL-D1 may start after OTEL-C1 lands.** Context propagation builds on span helpers.
- **OTEL-D2 may start after OTEL-D1 lands.**
- **OTEL-E1 is independent** — browser utility has no dependencies.
- **OTEL-E2 is last** — README, LICENSE, and CI polish wrap everything up.

## Definition of Done — Binding for Every Story

- `pnpm nx run-many -t lint test typecheck build` stays green, **including the 20-cell
  GMT timezone matrix**. `packages/gmt-otel` must not perturb `packages/gmt`.
- **Changesets required.** Unlike `apps/dox`, `@northguild/gmt-otel` is published to npm,
  so every story that modifies source needs a `.changeset/*.md` entry.
- No `Date` object anywhere. All inputs are ISO 8601 strings; outputs are strings, numbers,
  booleans, or arrays.
- Wrap all Temporal calls in `try-catch`. Bad input returns sentinels, never throws.
- Full IANA timezone coverage for timezone-aware functions (not locale matrix — gmt-otel
  output is not locale-dependent).
