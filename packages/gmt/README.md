# @burglekitt/gmt

**Give Me Temporal!** — The date and time library JavaScript deserved from the start.

`gmt` wraps the [Temporal API](https://tc39.es/proposal-temporal/) in a clean, ergonomic interface that keeps you out of `Date` hell forever. No mutation. No timezone guessing. No 2-AM DST surprises. Just ISO strings in, ISO strings out, and Temporal doing the heavy lifting underneath.

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

```typescript
import * as plain from "@burglekitt/gmt/plain";
import * as zoned from "@burglekitt/gmt/zoned";

// Add 90 days to a date
plain.math.addDate("2026-01-01", 90, "day");
// => "2026-04-01"

// List every day in February 2024 (leap year)
plain.map.mapDaysInMonth("2024-02");
// => ["2024-02-01", "2024-02-02", ..., "2024-02-29"]

// Check if a date is before another
plain.compare.isBeforeDate("2026-01-01", "2026-06-15");
// => true

// Convert a ZonedDateTime to a readable string
zoned.format.formatZonedDateTime(
  "2026-03-17T09:00:00+00:00[UTC]",
  "en-US",
  { dateStyle: "full", timeStyle: "short" }
);
// => "Tuesday, March 17, 2026 at 9:00 AM"

// Get all hours in a New York day — DST-aware (23 on spring forward, 25 on fall back)
zoned.map.mapZonedHoursInDay("2026-03-08T12:00:00-05:00[America/New_York]");
// => ["2026-03-08T00:00:00-05:00[America/New_York]", ..., 23 entries]
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

### `@burglekitt/gmt/plain`

Plain operations are for date and time values with no timezone. Use these when you need to represent a calendar date, a clock time, or a local datetime that should not shift when someone crosses a timezone boundary.

#### `plain.compare`

```typescript
areDatesEqual(a: string, b: string): boolean
areTimesEqual(a: string, b: string): boolean
areDateTimesEqual(a: string, b: string): boolean
isAfterDate(a: string, b: string): boolean
isBeforeDate(a: string, b: string): boolean
isAfterTime(a: string, b: string): boolean
isBeforeTime(a: string, b: string): boolean
isAfterDateTime(a: string, b: string): boolean
isBeforeDateTime(a: string, b: string): boolean
```

#### `plain.format`

```typescript
formatDate(dateStr: string, locale: string, options?: Intl.DateTimeFormatOptions): string
formatTime(timeStr: string, locale: string, options?: Intl.DateTimeFormatOptions): string
formatDateTime(dateTimeStr: string, locale: string, options?: Intl.DateTimeFormatOptions): string
```

#### `plain.map`

```typescript
mapDaysInMonth(monthStr: string): string[]          // "2024-02" => ["2024-02-01", ..., "2024-02-29"]
mapDatesInRange(start: string, end: string, stepDays?: number): string[]
```

#### `plain.math`

```typescript
addDate(dateStr: string, amount: number, unit: "year" | "month" | "week" | "day"): string
subtractDate(dateStr: string, amount: number, unit: "year" | "month" | "week" | "day"): string
addTime(timeStr: string, amount: number, unit: "hour" | "minute" | "second" | "millisecond"): string
subtractTime(timeStr: string, amount: number, unit: "hour" | "minute" | "second" | "millisecond"): string
addDateTime(dateTimeStr: string, amount: number, unit: DateTimeUnit): string
subtractDateTime(dateTimeStr: string, amount: number, unit: DateTimeUnit): string
```

#### `plain.parse`

```typescript
parseDateUnit(dateStr: string, unit: "year" | "month" | "day"): number
parseTimeUnit(timeStr: string, unit: "hour" | "minute" | "second" | "millisecond"): number
parseDateTimeUnit(dateTimeStr: string, unit: DateTimeUnit): number
```

#### `plain.validators`

```typescript
isValidDate(value: string): boolean
isValidTime(value: string): boolean
isValidDateTime(value: string): boolean
isValidDateRange(start: string, end: string): boolean
```

---

### `@burglekitt/gmt/zoned`

Zoned operations attach a real IANA timezone to every value. Use these when you care about what the clock on the wall says in a specific place, including DST transitions.

#### `zoned.compare`

```typescript
areZonedEqual(a: string, b: string): boolean
isAfterZoned(a: string, b: string): boolean   // compares at the Instant level
isBeforeZoned(a: string, b: string): boolean  // compares at the Instant level
```

#### `zoned.format`

```typescript
formatZonedDateTime(zdtStr: string, locale: string, options?: Intl.DateTimeFormatOptions): string
formatZonedRange(startStr: string, endStr: string, locale: string, options?: Intl.DateTimeFormatOptions): string
```

#### `zoned.map`

```typescript
mapZonedHoursInDay(zdtStr: string): string[]              // DST-aware: 23, 24, or 25 entries
mapZonedDatesInRange(start: string, end: string, stepDays?: number): string[]  // enforces same timezone
```

#### `zoned.math`

```typescript
addZoned(zdtStr: string, amount: number, unit: DateTimeUnit): string
subtractZoned(zdtStr: string, amount: number, unit: DateTimeUnit): string
```

#### `zoned.parse`

```typescript
parseZonedDate(zdtStr: string): string
parseZonedTime(zdtStr: string): string
parseZonedTimezone(zdtStr: string): string
parseZonedUnit(zdtStr: string, unit: DateTimeUnit): number
```

#### `zoned.validate`

```typescript
isValidZonedDateTime(value: string): boolean
isValidTimezone(value: string): boolean
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
