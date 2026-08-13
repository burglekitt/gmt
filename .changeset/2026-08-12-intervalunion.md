---
"@burglekitt/gmt": minor
---

Add `intervalUnionDate`, `intervalUnionTime`, `intervalUnionDateTime`
(plain), `intervalUnionUtc` (utc), `intervalUnionUnix` (unix), and
`intervalUnionZoned` (zoned) — interval union. Each accepts two intervals
and returns the combined span when they overlap or are directly adjacent,
or `null` when they are disjoint with a gap:

- Adjacent intervals (e.g. `aEnd === bStart`) share one instant and ARE merged
  into a single combined span.
- Returns `null` when intervals are disjoint with a gap, or when either interval
  is invalid (`start > end`).
- Returns `null` on malformed input (never throws).
- Return shape: `{ start: string; end: string } | null` (or `{ start: number;
  end: number } | null` for Unix).
