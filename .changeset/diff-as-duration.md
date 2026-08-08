---
"@burglekitt/gmt": minor
---

Adds `diffDateAsDuration`, `diffDateTimeAsDuration`, `diffZonedAsDuration`, `diffUnixAsDuration`, and `diffUtcAsDuration` — sibling functions to the existing `diffDate`/`diffDateTime`/`diffZoned`/`diffUnix`/`diffUtc`, bridging to the `duration` namespace by returning an ISO 8601 duration string (e.g. `"P1DT2H"`) instead of a single-unit number.

- Each takes a single `unit` (not an array like its counterpart) to set the duration's `largestUnit` — an ISO duration string already expresses a full multi-unit breakdown via `largestUnit` alone.
- Accepts the same `smallestUnit`/`roundingIncrement`/`roundingMode` rounding options as its counterpart (controlling the underlying difference), plus new `toStringSmallestUnit`/`fractionalSecondDigits`/`toStringRoundingMode` options controlling the precision of the rendered string itself (mirroring `parseDuration`'s options) — kept as separately-named keys since both option sets have colliding `smallestUnit`/`roundingMode` names with different Temporal types.
- Returns `""` on invalid input, matching the `duration` namespace's string sentinel convention (rather than `null`, which its counterpart number-returning functions use).

This completes Story Group A (Duration) of the Luxon/react-aria parity roadmap.
