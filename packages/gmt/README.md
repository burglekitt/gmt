# @burglekitt/gmt

# Give Me Temporal!

> `@burglekitt/gmt`

<p align="center">
  <a href="https://giphy.com/gifs/aint-nobody-got-time-for-that-oh-lord-jesus-its-a-fire-njAjh98E1PUha">
    <img src="https://media.giphy.com/media/njAjh98E1PUha/giphy.gif" alt="Ain't nobody got time for new Date()" width="480" />
  </a>
  <br><br>
  <em>Ain't nobody got time for <code>new Date()</code>.</em>
</p>

The date and time library JavaScript deserved from the start. `gmt` wraps the [Temporal API](https://tc39.es/proposal-temporal/) in a clean, ergonomic interface that keeps you out of `Date` hell forever. No mutation. No timezone guessing. No 2-AM DST surprises. Just ISO strings in, ISO strings out, and Temporal doing the heavy lifting underneath.

**Status:** Pre-alpha. APIs may change. But the vibes are immaculate.

---

## Why This Exists

JavaScript's `Date` is a crime scene.

- `new Date("2024-03-10")` gives you UTC midnight — not local midnight
- `date.getMonth()` returns 0 for January, because why not
- Every timezone operation requires a third-party library the size of a dictionary
- Mutation is the default, which means passing a `Date` anywhere is a gamble

`Temporal` fixes all of this. `gmt` makes it fast to use:

- Functions accept **ISO 8601 strings** and return **ISO 8601 strings**
- The underlying `Temporal` objects never escape — they're an implementation detail
- Plain (timezone-free) and Zoned (timezone-aware) operations are strictly separated
- DST is handled correctly by default, not as an afterthought
- Fully tree-shakable: import only what you use

If you are still calling `new Date()`, this library is here to judge you and then help you.

---

## Install

```bash
npm install @burglekitt/gmt
```

```bash
bun add @burglekitt/gmt
```

---

## Quick Start

### Date arithmetic

```typescript
import { addDate, subtractDate } from "@burglekitt/gmt/plain/calculate";

addDate("2026-01-01", 90, "day");         // "2026-04-01"
addDate("2026-01-01", 1, "year");          // "2027-01-01"
subtractDate("2026-03-31", 1, "month");   // "2026-02-28"
```

### Comparisons

```typescript
import { isBeforeDate, isAfterDate, areDatesEqual } from "@burglekitt/gmt/plain/compare";

isBeforeDate("2026-01-01", "2026-06-15");             // true
isAfterDate("2026-12-31", "2026-01-01");              // true
areDatesEqual("2026-03-17", "2026-03-17T09:00:00");   // true — date part is extracted
```

### Mapping

```typescript
import { mapDaysInMonth, mapDatesInRange } from "@burglekitt/gmt/plain/map";

// Every day in February 2024 — leap year, 29 days
mapDaysInMonth("2024-02");
// ["2024-02-01", "2024-02-02", ..., "2024-02-29"]

// Every Monday between two dates (stepDays: 7)
mapDatesInRange("2026-03-02", "2026-03-30", 7);
// ["2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30"]
```

### Formatting

```typescript
import { formatDate, formatDateTime } from "@burglekitt/gmt/plain/format";
import { formatZonedDateTime } from "@burglekitt/gmt/zoned/format";

formatDate("2026-03-17", "en-US", { dateStyle: "full" });
// "Tuesday, March 17, 2026"

formatZonedDateTime("2026-03-17T09:00:00+00:00[UTC]", "en-US", { dateStyle: "full", timeStyle: "short" });
// "Tuesday, March 17, 2026 at 9:00 AM"
```

### Timezone-aware operations

```typescript
import { addZoned, subtractZoned } from "@burglekitt/gmt/zoned/calculate";
import { isAfterZoned } from "@burglekitt/gmt/zoned/compare";
import { mapZonedHoursInDay } from "@burglekitt/gmt/zoned/map";

// Add across a DST boundary — Temporal handles the offset change for you
addZoned("2026-03-07T23:00:00-05:00[America/New_York]", 2, "hour");
// "2026-03-08T02:00:00-04:00[America/New_York]" — note offset changed to -04:00

// Compare across timezones — compared at the Instant level, no offset confusion
isAfterZoned(
  "2026-03-17T10:00:00+05:30[Asia/Kolkata]",
  "2026-03-17T09:00:00+00:00[UTC]"
);
// false — both resolve to the same instant

// Every hour in a New York day during DST spring-forward — only 23 entries
mapZonedHoursInDay("2026-03-08T12:00:00-05:00[America/New_York]");
// ["2026-03-08T00:00:00-05:00[...]", ..., 23 entries — 2 AM never happens]
```

### Parsing & validation

```typescript
import { parseDateUnit } from "@burglekitt/gmt/plain/parse";
import { isValidDate, isValidDateRange } from "@burglekitt/gmt/plain/validate";
import { isValidZonedDateTime } from "@burglekitt/gmt/zoned/validate";

parseDateUnit("2026-03-17", "month");                                    // 3
isValidDate("2026-13-01");                                               // false
isValidDateRange("2026-01-01", "2026-12-31");                            // true
isValidZonedDateTime("2026-03-17T09:00:00+00:00[UTC]");                  // true
```

---

## Design Rules

| Rule | Why |
|---|---|
| All inputs and outputs are ISO 8601 strings | Avoids `Date` object pitfalls entirely |
| `Temporal` objects never escape public APIs | Implementation detail, not your problem |
| `plain/` and `zoned/` are strictly separate | Mixing them is a bug waiting to happen |
| Functions are pure and stateless | Easy to test, reason about, and compose |
| DST is handled at the Instant level | Zoned operations are always correct |

---

## API Reference

### `@burglekitt/gmt/plain/compare`

```typescript
import { areDatesEqual, areTimesEqual, areDateTimesEqual } from "@burglekitt/gmt/plain/compare";
import { isAfterDate, isBeforeDate } from "@burglekitt/gmt/plain/compare";
import { isAfterTime, isBeforeTime } from "@burglekitt/gmt/plain/compare";
import { isAfterDateTime, isBeforeDateTime } from "@burglekitt/gmt/plain/compare";
```

### `@burglekitt/gmt/plain/format`

```typescript
import { formatDate, formatTime, formatDateTime } from "@burglekitt/gmt/plain/format";
```

### `@burglekitt/gmt/plain/map`

```typescript
import { mapDaysInMonth, mapDatesInRange } from "@burglekitt/gmt/plain/map";

mapDaysInMonth(monthStr: string): string[]
mapDatesInRange(start: string, end: string, stepDays?: number): string[]
```

### `@burglekitt/gmt/plain/calculate`

```typescript
import { addDate, subtractDate } from "@burglekitt/gmt/plain/calculate";
import { addTime, subtractTime } from "@burglekitt/gmt/plain/calculate";
import { addDateTime, subtractDateTime } from "@burglekitt/gmt/plain/calculate";

// Date units: "year" | "month" | "week" | "day"
// Time units: "hour" | "minute" | "second" | "millisecond"
// DateTime units: all of the above
```

### `@burglekitt/gmt/plain/parse`

```typescript
import { parseDateUnit, parseTimeUnit, parseDateTimeUnit } from "@burglekitt/gmt/plain/parse";
```

### `@burglekitt/gmt/plain/validate`

```typescript
import { isValidDate, isValidTime, isValidDateTime, isValidDateRange } from "@burglekitt/gmt/plain/validate";
```

---

### `@burglekitt/gmt/zoned/compare`

```typescript
import { areZonedEqual, isAfterZoned, isBeforeZoned } from "@burglekitt/gmt/zoned/compare";
// isAfterZoned / isBeforeZoned compare at the Instant level — timezone-offset-independent
```

### `@burglekitt/gmt/zoned/format`

```typescript
import { formatZonedDateTime, formatZonedRange } from "@burglekitt/gmt/zoned/format";
```

### `@burglekitt/gmt/zoned/map`

```typescript
import { mapZonedHoursInDay, mapZonedDatesInRange } from "@burglekitt/gmt/zoned/map";

mapZonedHoursInDay(zdtStr: string): string[]              // DST-aware: 23, 24, or 25 entries
mapZonedDatesInRange(start: string, end: string, stepDays?: number): string[]  // throws if timezones differ
```

### `@burglekitt/gmt/zoned/calculate`

```typescript
import { addZoned, subtractZoned } from "@burglekitt/gmt/zoned/calculate";
```

### `@burglekitt/gmt/zoned/parse`

```typescript
import { parseZonedDate, parseZonedTime, parseZonedTimezone, parseZonedUnit } from "@burglekitt/gmt/zoned/parse";
```

### `@burglekitt/gmt/zoned/validate`

```typescript
import { isValidZonedDateTime, isValidTimezone } from "@burglekitt/gmt/zoned/validate";
```

---

## Regex and Schemas

Low-level building blocks for parsing and validation, exported from subpaths:

- `@burglekitt/gmt` — top-level re-exports `Temporal` from `@js-temporal/polyfill`
- `src/regex/` — composable regex patterns for dates, times, datetimes, and timezones
- `src/schemas/` — Zod schemas for all types, usable in form validation and API boundaries

---

## Development

```bash
bun install          # install dependencies
bun run test         # run all tests (Vitest)
bun run build        # build the package
bun run lint         # lint with Biome
bun run format       # format with Biome
```

---

## TODO

**plain**

- [x] `areDatesEqual` / `areTimesEqual` / `areDateTimesEqual` — equality checks
- [x] `isAfterDate` / `isBeforeDate` — date ordering
- [x] `isAfterTime` / `isBeforeTime` — time ordering
- [x] `isAfterDateTime` / `isBeforeDateTime` — datetime ordering
- [x] `formatDate` / `formatTime` / `formatDateTime` — locale-aware formatting
- [x] `addDate` / `subtractDate` — date arithmetic
- [x] `addTime` / `subtractTime` — time arithmetic
- [x] `addDateTime` / `subtractDateTime` — datetime arithmetic
- [x] `parseDateUnit` / `parseTimeUnit` / `parseDateTimeUnit` — extract numeric fields
- [x] `isValidDate` / `isValidTime` / `isValidDateTime` / `isValidDateRange` — validation
- [x] `mapDaysInMonth` — list all days in a calendar month
- [x] `mapDatesInRange` — list dates between two anchors with a configurable step
- [ ] `isLeapYear(yearStr: string): boolean` — is this year a leap year?
- [ ] `getDayOfWeek(dateStr: string): number` — returns ISO weekday 1 (Mon) to 7 (Sun)
- [ ] `getWeekNumber(dateStr: string): number` — ISO week number (1–53)
- [ ] `getQuarter(dateStr: string): number` — calendar quarter (1–4)
- [ ] `getDaysInMonth(monthStr: string): number` — total days in a given YYYY-MM month
- [ ] `startOfMonth(dateStr: string): string` — first day of the month
- [ ] `endOfMonth(dateStr: string): string` — last day of the month
- [ ] `startOfWeek(dateStr: string, weekStartsOn?: "monday" | "sunday"): string`
- [ ] `endOfWeek(dateStr: string, weekStartsOn?: "monday" | "sunday"): string`
- [ ] `isWeekend(dateStr: string): boolean`
- [ ] `isWeekday(dateStr: string): boolean`
- [ ] `isBetweenDates(dateStr: string, start: string, end: string): boolean`
- [ ] `isSameMonth(a: string, b: string): boolean`
- [ ] `isSameYear(a: string, b: string): boolean`
- [ ] `diffDates(a: string, b: string): number` — signed number of days between two dates
- [ ] `diffDateTimes(a: string, b: string, unit: DateTimeUnit): number` — signed duration in the given unit
- [ ] `clampDate(dateStr: string, min: string, max: string): string`
- [ ] `mapDaysInWeek(dateStr: string, weekStartsOn?: "monday" | "sunday"): string[]`
- [ ] `mapWeekdaysInMonth(monthStr: string, weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7): string[]` — all Tuesdays in March, etc.
- [ ] `mapMonthsInRange(startMonth: string, endMonth: string): string[]` — "2024-01" to "2024-12"
- [ ] `mapTimesInDay(stepMinutes: number): string[]` — evenly spaced time slots across 24 hours
- [ ] `mapDateTimesInDay(dateStr: string, stepMinutes: number): string[]`
- [ ] `isValidMonthString(value: string): boolean` — validates "YYYY-MM" format

**zoned**

- [x] `areZonedEqual` — equality at the Instant level
- [x] `isAfterZoned` / `isBeforeZoned` — instant-level ordering across timezones
- [x] `formatZonedDateTime` / `formatZonedRange` — locale-aware formatting
- [x] `addZoned` / `subtractZoned` — DST-correct arithmetic
- [x] `parseZonedDate` / `parseZonedTime` / `parseZonedTimezone` / `parseZonedUnit`
- [x] `isValidZonedDateTime` / `isValidTimezone`
- [x] `mapZonedHoursInDay` — all hours in a local day including DST transitions (23/24/25 entries)
- [x] `mapZonedDatesInRange` — local date range between two zoned anchors
- [ ] `convertTimezone(zdtStr: string, toTimeZone: string): string` — reinterpret in a different timezone
- [ ] `toInstant(zdtStr: string): string` — extract the UTC instant as an ISO string
- [ ] `fromInstant(instantStr: string, timeZone: string): string` — build a ZonedDateTime from a UTC instant
- [ ] `getUtcOffset(zdtStr: string): string` — e.g. `"+05:30"`
- [ ] `isInDST(zdtStr: string): boolean` — is this moment in daylight saving time?
- [ ] `diffZoned(a: string, b: string, unit: DateTimeUnit): number` — signed duration at the Instant level
- [ ] `clampZoned(zdtStr: string, min: string, max: string): string`
- [ ] `isBetweenZoned(zdtStr: string, start: string, end: string): boolean`
- [ ] `startOfZonedDay(zdtStr: string): string` — local midnight in the given timezone
- [ ] `endOfZonedDay(zdtStr: string): string` — 23:59:59.999 in the given timezone
- [ ] `mapZonedDaysInMonth(anchorZdtStr: string): string[]` — all days in the local calendar month
- [ ] `mapZonedWeek(anchorZdtStr: string, weekStartsOn?: "monday" | "sunday"): string[]`
- [ ] `mapZonedMonthsInRange(start: string, end: string): string[]` — month anchors between two zoned datetimes

---

## Requirements

- Node.js >= 18.0.0
- Bun (recommended for development)

---

## License

MIT — See [LICENSE](../../LICENSE) for details.
