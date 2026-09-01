# gmt-otel — Tracker

> **`@northguild/gmt-otel`** bridges `@northguild/gmt` and OpenTelemetry for timezone-aware,
> nanosecond-precision observability. All functions map to existing gmt APIs — nothing is
> invented from thin air. See [refined-plan.md](refined-plan.md) for the full spec.

---

## Overview

The original draft plan (now at [overview.md](overview.md)) was heavily hallucinated: it
invented `GMTDate` types that don't exist, assumed gmt had methods like `GMTDate.now()`
and `toUTC()`, and claimed "zero dependencies on OTel" when the package's entire value is
integrating with `@opentelemetry/api`.

The refined plan ([refined-plan.md](refined-plan.md)) corrects every hallucination. Every
function in the new package maps to an existing gmt API. The package has two dependency
tiers:

- **Required:** `@northguild/gmt` (workspace dependency)
- **Optional peer:** `@opentelemetry/api` — timestamp/timezone/duration tiers work with
  just gmt; span/baggage tiers require OTel at runtime

## Stories

The 4 tiers map onto 4 GitHub issues. Each issue carries lettered sub-stories built in
sequence within the issue.

| Order | Story                                       | GitHub Issue | Status      |
| ----- | ------------------------------------------- | ------------ | ----------- |
| 1     | OTEL-A1 (OTEL-A1a, OTEL-A1b)                | #143         | Not started |
| 2     | OTEL-A2 (OTEL-A2a, OTEL-A2b)                | #144         | Not started |
| 3     | OTEL-B1 (OTEL-B1a, OTEL-B1b, OTEL-B1c)      | #145         | Not started |
| 4     | OTEL-C1 (OTEL-C1a, OTEL-C1b)                | #146         | Not started |

**An issue closes when its last sub-story lands.**

## Build Order

- **Tier 0 (OTEL-A1) is order-locked.** Timestamp conversion is the core value — everything
  else depends on it. Build OTEL-A1a → OTEL-A1b in sequence.
- **Tier 1 (OTEL-A2) may start after OTEL-A1 lands.** Timezone intelligence and duration
  conversion are independent of each other but both depend on the package skeleton from
  OTEL-A1.
- **Tier 2 (OTEL-B1) may start after OTEL-A2 lands.** Span integration uses all prior tiers.
- **Tier 3 (OTEL-C1) is optional and may be deferred.** Context propagation is the least
  critical layer.

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
