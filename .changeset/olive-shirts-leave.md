---
"@burglekitt/gmt": minor
---

New relative time formatters and rounded-out format API surface.

**New formatters:**

- `formatRelativeDate` — relative dates against a `PlainDate` reference (e.g. "3 days ago", "next year").
- `formatRelativeDateTime` — relative datetimes against a `PlainDateTime` reference (e.g. "in 2 hours", "yesterday").
- `formatRelativeTime` — relative wall times against a `PlainTime` reference (e.g. "30 minutes ago").
- `formatRelativeZoned` — relative zoned datetimes against a `ZonedDateTime` reference, DST-safe.
- `formatRelativeUnix` — relative time from a Unix epoch (ms or seconds) against a reference epoch.
- `formatRelativeUtc` — relative time from a UTC ISO string against a UTC reference.

All relative formatters:
- Accept `numeric: "auto" | "always"` and `style: "long" | "short" | "narrow"` (passed through to `Intl.RelativeTimeFormat`).
- Auto-select the largest sensible unit (second/minute/hour/day/week/month/year) unless `largestUnit` is provided.
- Pass output through `normalizeDateTime` for consistent NBSP/minus-sign handling.
- Return `""` for invalid input.

**Filled-in base formatters:**

- `formatUnix` — locale-aware formatting for Unix epochs (ms or seconds), with `timeZone` support including `"local"`.
- `formatUtc` — locale-aware formatting for UTC ISO strings.

**Test infrastructure:**

- Adds `hasFullIcu` probe in `src/test/` so locale tests are robust to runtimes shipping partial ICU (e.g. some Node builds lack non-English day-period or timezone data).
- Locale rows that diverge between full and partial ICU now carry inline ternaries with both expected strings visible, so the test tables continue to serve as documentation.
