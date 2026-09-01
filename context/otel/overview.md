# `@northguild/gmt-otel` Package Plan

> **A bridge between `@northguild/gmt` and OpenTelemetry for timezone-aware, nanosecond-precision observability.**

---

## 📦 Package Overview

### **Name**

**`@northguild/gmt-otel`**

- Clear, concise, and aligns with the existing `@northguild/gmt` ecosystem.
- Avoids naming conflicts with official OpenTelemetry packages (e.g., `@opentelemetry/*`).

### **Purpose**

This package solves the **timestamp and timezone gaps** in OpenTelemetry’s JavaScript SDK by:

1. Providing **nanosecond-precision timestamps** (OTel’s standard) using `@northguild/gmt`.
2. Adding **first-class timezone support** to spans, traces, and logs.
3. Enabling **timezone-aware observability** for global applications (e.g., Dash0’s multi-tenant UIs).
4. Offering **drop-in utilities** for OTel JS SDK integration.

### **Target Users**

- **OpenTelemetry JS users** who need timezone-aware tracing.
- **Dash0 customers** (or similar observability platforms) with global users.
- **Developers** building distributed systems with time-sensitive logic (e.g., DST transitions, leap seconds).

---

## 🎯 Core Goals

1. **Seamless Integration**: Works with `@opentelemetry/api`, `@opentelemetry/sdk-trace-node`, and other OTel JS packages.
2. **Zero Dependencies**: Only depends on `@northguild/gmt` and OTel core packages.
3. **Type Safety**: Full TypeScript support with comprehensive type definitions.
4. **Performance**: Minimal overhead (target: &lt;1KB bundle size, &lt;0.1ms per operation).
5. **Compatibility**: Supports Node.js 18+ and modern browsers (Chrome 144+, Firefox 139+, Edge 144+).

---

## 📂 Package Structure

```bash
@northguild/gmt-otel/
├── src/
│   ├── index.ts               # Exports all public functions
│   ├── timestamps.ts          # Timestamp conversion (OTel ↔ GMT)
│   ├── spans.ts               # Span helpers (timezone-aware spans)
│   ├── timezones.ts           # Timezone utilities
│   ├── iso.ts                 # ISO 8601 parsing/serialization
│   ├── context.ts             # Context propagation (timezone in OTel context)
│   ├── durations.ts           # Duration conversion (OTel ↔ GMT)
│   ├── validation.ts          # Validation utilities
│   └── types.ts               # Custom types (e.g., TimeInput, SpanAttributes)
├── test/
│   ├── timestamps.test.ts
│   ├── spans.test.ts
│   ├── timezones.test.ts
│   ├── iso.test.ts
│   ├── context.test.ts
│   ├── durations.test.ts
│   └── validation.test.ts
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

## 🔧 Core Functions (Must-Have)

### **1. Timestamp Conversion (OTel ↔ GMT)**

| **Function**        | **Signature**                                           | **Purpose**                                                                 | **Example**                                                                              |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `toOtelTimestamp`   | `(date: GMTDate                                         | ZonedDateTime                                                               | Instant): bigint`                                                                        | Convert GMT types to **OTel nanosecond timestamp** (Unix epoch).                   | `toOtelTimestamp(GMTDate.now()) → 1717238400000000000n` |
| `fromOtelTimestamp` | `(timestamp: bigint, timezone?: string): ZonedDateTime` | Convert OTel timestamp to **GMT `ZonedDateTime`** (with optional timezone). | `fromOtelTimestamp(1717238400000000000n, 'Europe/Helsinki') → 2024-06-01T15:00:00+03:00` |
| `toOtelTimeInput`   | `(date: GMTDate                                         | ZonedDateTime): TimeInput` (OTel type)                                      | Convert GMT types to OTel’s **`TimeInput`** (for `hrTime()` compatibility).              | `toOtelTimeInput(GMTDate.now()) → [1717238400, 123456789]` (seconds + nanoseconds) |
| `fromOtelTimeInput` | `(timeInput: TimeInput): ZonedDateTime`                 | Convert OTel `TimeInput` (from `hrTime()`) to GMT `ZonedDateTime`.          | `fromOtelTimeInput([1717238400, 123456789]) → 2024-06-01T12:00:00.123456789Z`            |

---

### **2. Span Helpers (Timezone-Aware Spans)**

| **Function**       | **Signature**                                                                        | **Purpose**                                                                | **Example**                                                        |
| ------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `startSpan`        | `(name: string, options?: { timezone?: string, attributes?: SpanAttributes }): Span` | Start a span with **timezone-aware start time** (uses GMT under the hood). | `startSpan('request', { timezone: 'Europe/Helsinki' })`            |
| `endSpan`          | `(span: Span, timezone?: string): void`                                              | End a span with **timezone-aware end time**.                               | `endSpan(span, 'Europe/Helsinki')`                                 |
| `getSpanTimezone`  | `(span: Span): string                                                                | undefined`                                                                 | Extract the **timezone** from a span’s attributes.                 | `getSpanTimezone(span) → 'Europe/Helsinki'` |
| `setSpanTimezone`  | `(span: Span, timezone: string): void`                                               | Set the **timezone** as a span attribute.                                  | `setSpanTimezone(span, 'America/New_York')`                        |
| `getSpanLocalTime` | `(span: Span, timezone: string): ZonedDateTime`                                      | Get a span’s **start/end time in a specific timezone**.                    | `getSpanLocalTime(span, 'Asia/Tokyo') → 2024-06-01T20:00:00+09:00` |

---

### **3. Timezone Utilities**

| **Function**         | **Signature**                                | **Purpose**                                                                                        | **Example**                                                                      |
| -------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `getCurrentTimezone` | `(): string`                                 | Detect the **system/browser timezone** (e.g., `Intl.DateTimeFormat().resolvedOptions().timeZone`). | `getCurrentTimezone() → 'Europe/Helsinki'`                                       |
| `toUTC`              | `(date: GMTDate                              | ZonedDateTime): Instant`                                                                           | Convert any GMT date to **UTC `Instant`**.                                       | `toUTC(ZonedDateTime.fromISO('2024-06-01T15:00:00+03:00')) → 2024-06-01T12:00:00Z` |
| `toZonedDateTime`    | `(date: GMTDate                              | Instant, timezone: string): ZonedDateTime`                                                         | Convert a GMT date to a **specific timezone**.                                   | `toZonedDateTime(GMTDate.now(), 'America/Los_Angeles')`                            |
| `formatInTimezone`   | `(date: GMTDate                              | Instant, timezone: string, format?: string): string`                                               | Format a date in a **specific timezone** (e.g., for logs/UI).                    | `formatInTimezone(GMTDate.now(), 'Europe/Paris', 'HH:mm:ss') → '14:30:45'`         |
| `getTimezoneOffset`  | `(timezone: string, date?: GMTDate): number` | Get the **UTC offset in seconds** for a timezone at a given date (handles DST).                    | `getTimezoneOffset('Europe/London', GMTDate.fromISO('2024-06-01')) → 3600` (BST) |

---

### **4. ISO 8601 &amp; Serialization**

| **Function**    | **Signature**                                               | **Purpose**                                                         | **Example**                                                                          |
| --------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `toISOString`   | `(date: GMTDate                                             | ZonedDateTime, includeOffset?: boolean): string`                    | Convert GMT date to **ISO 8601 string** (with/without timezone offset).              | `toISOString(ZonedDateTime.now(), true) → '2024-06-01T15:00:00+03:00'` |
| `fromISOString` | `(isoString: string): ZonedDateTime`                        | Parse **ISO 8601 string** (with timezone) into GMT `ZonedDateTime`. | `fromISOString('2024-06-01T15:00:00+03:00') → ZonedDateTime`                         |
| `toOTelJSON`    | `(date: GMTDate                                             | ZonedDateTime): string`                                             | Serialize GMT date to **OTel’s JSON timestamp format** (nanoseconds as string).      | `toOTelJSON(GMTDate.now()) → '1717238400000000000'`                    |
| `fromOTelJSON`  | `(jsonTimestamp: string, timezone?: string): ZonedDateTime` | Parse OTel JSON timestamp to GMT `ZonedDateTime`.                   | `fromOTelJSON('1717238400000000000', 'Europe/Helsinki') → 2024-06-01T15:00:00+03:00` |

---

## 🛠️ Utility Functions (Nice-to-Have)

### **5. Context &amp; Propagation**

| **Function**             | **Signature**                                   | **Purpose**                                                                            | **Example**                                                      |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `getTimezoneFromContext` | `(context: Context): string                     | undefined`                                                                             | Extract **timezone** from OTel `Context` (e.g., from `Baggage`). | `getTimezoneFromContext(activeContext) → 'Europe/Helsinki'` |
| `setTimezoneInContext`   | `(context: Context, timezone: string): Context` | Set **timezone** in OTel `Context` for propagation.                                    | `setTimezoneInContext(activeContext, 'Asia/Tokyo')`              |
| `propagateTimezone`      | `(carrier: any, timezone: string): void`        | Inject **timezone** into a carrier (e.g., HTTP headers) for cross-service propagation. | `propagateTimezone(requestHeaders, 'America/New_York')`          |

---

### **6. Duration &amp; Intervals**

| **Function**       | **Signature**                     | **Purpose**                                                | **Example**                                                                  |
| ------------------ | --------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `toOtelDuration`   | `(duration: Duration): number`    | Convert GMT `Duration` to **OTel duration** (nanoseconds). | `toOtelDuration(Duration.from({ hours: 1 })) → 3600000000000` (1 hour in ns) |
| `fromOtelDuration` | `(nanoseconds: number): Duration` | Convert OTel duration (nanoseconds) to GMT `Duration`.     | `fromOtelDuration(3600000000000) → Duration.from({ hours: 1 })`              |
| `spanDuration`     | `(span: Span): Duration`          | Get a span’s **duration as GMT `Duration`**.               | `spanDuration(span) → Duration.from({ milliseconds: 123 })`                  |

---

### **7. Validation**

| **Function**           | **Signature**                                | **Purpose**                                                   | **Example**                                                                         |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| `isValidTimezone`      | `(timezone: string): boolean`                | Check if a **timezone is valid** (IANA database).             | `isValidTimezone('Europe/Helsinki') → true`                                         |
| `isValidOTelTimestamp` | `(timestamp: bigint                          | string): boolean`                                             | Validate an **OTel timestamp** (nanoseconds since epoch).                           | `isValidOTelTimestamp(1717238400000000000n) → true` |
| `isDSTTransition`      | `(date: GMTDate, timezone: string): boolean` | Check if a date is **during a DST transition** in a timezone. | `isDSTTransition(GMTDate.fromISO('2024-03-31T02:00:00'), 'Europe/Helsinki') → true` |

---

## 📄 Example `index.ts` Exports

```typescript
// Core Timestamp Conversion
export {
  toOtelTimestamp,
  fromOtelTimestamp,
  toOtelTimeInput,
  fromOtelTimeInput,
} from "./timestamps";

// Span Helpers
export {
  startSpan,
  endSpan,
  getSpanTimezone,
  setSpanTimezone,
  getSpanLocalTime,
} from "./spans";

// Timezone Utilities
export {
  getCurrentTimezone,
  toUTC,
  toZonedDateTime,
  formatInTimezone,
  getTimezoneOffset,
} from "./timezones";

// ISO 8601 & Serialization
export { toISOString, fromISOString, toOTelJSON, fromOTelJSON } from "./iso";

// Context Propagation
export {
  getTimezoneFromContext,
  setTimezoneInContext,
  propagateTimezone,
} from "./context";

// Duration & Intervals
export { toOtelDuration, fromOtelDuration, spanDuration } from "./durations";

// Validation
export {
  isValidTimezone,
  isValidOTelTimestamp,
  isDSTTransition,
} from "./validation";
```

---

## 🚀 Example Usage in a Dash0 App

```typescript
import {
  toOtelTimestamp,
  fromOtelTimestamp,
  startSpan,
  getSpanLocalTime,
  setSpanTimezone,
  toISOString,
} from "@northguild/gmt-otel";
import { trace, Span } from "@opentelemetry/api";
import { GMTDate, ZonedDateTime } from "@northguild/gmt";

// 1. Create a timezone-aware span
const span: Span = startSpan("api-request", {
  timezone: "Europe/Helsinki",
  attributes: { "http.method": "GET", "http.route": "/checkout" },
});

// 2. Simulate some work...
setTimeout(() => {
  // 3. End the span (automatically uses the timezone)
  span.end();

  // 4. Get the span's local time
  const localStartTime: ZonedDateTime = getSpanLocalTime(
    span,
    "Europe/Helsinki",
  );
  console.log("Local start time:", localStartTime.toISO()); // "2024-06-01T15:00:00+03:00"

  // 5. Convert a GMT date to OTel timestamp
  const gmtDate: GMTDate = GMTDate.now();
  const otelTimestamp: bigint = toOtelTimestamp(gmtDate);
  console.log("OTel timestamp:", otelTimestamp); // 1717238400000000000n

  // 6. Convert OTel timestamp back to GMT
  const zonedDateTime: ZonedDateTime = fromOtelTimestamp(
    otelTimestamp,
    "Europe/Helsinki",
  );
  console.log("ZonedDateTime:", zonedDateTime.toString()); // "2024-06-01T15:00:00+03:00"

  // 7. Format for logs
  const isoString: string = toISOString(zonedDateTime, true);
  console.log("ISO 8601:", isoString); // "2024-06-01T15:00:00+03:00"
}, 100);
```

---

## 📋 Implementation Roadmap

### **Phase 1: Core Functions (MVP)**

- [ ] `toOtelTimestamp`, `fromOtelTimestamp`
- [ ] `startSpan`, `endSpan`
- [ ] `toISOString`, `fromISOString`
- [ ] `getCurrentTimezone`, `toZonedDateTime`

**Goal**: Basic timezone-aware timestamp conversion and span creation.

### **Phase 2: Utilities &amp; Validation**

- [ ] `getSpanTimezone`, `setSpanTimezone`
- [ ] `toOtelTimeInput`, `fromOtelTimeInput`
- [ ] `isValidTimezone`, `isValidOTelTimestamp`
- [ ] `toOtelDuration`, `fromOtelDuration`

**Goal**: Full span integration and validation.

### **Phase 3: Advanced Features**

- [ ] `getTimezoneFromContext`, `setTimezoneInContext`
- [ ] `propagateTimezone`
- [ ] `isDSTTransition`
- [ ] `spanDuration`

**Goal**: Context propagation and edge-case handling.

---

## 🧪 Testing Strategy

### **Test Coverage**

1. **Timestamp Conversion**:

- Round-trip tests (`GMTDate → OTel → GMTDate`).
- Edge cases (epoch, max safe integer, DST transitions).

1. **Span Integration**:

- Verify spans retain timezone metadata.
- Test `startSpan`/`endSpan` with different timezones.

1. **Timezone Handling**:

- Test all IANA timezones (e.g., `Europe/Helsinki`, `America/New_York`).
- Validate DST transitions (e.g., `2024-03-31T02:00:00` in Europe).

1. **ISO 8601**:

- Parse/serialize with and without timezone offsets.
- Test invalid inputs (e.g., `2024-02-30`).

1. **Performance**:

- Benchmark against `Date` and Temporal API.
- Target: &lt;0.1ms per operation.

### **Example Test (Vitest)**

```typescript
import { describe, it, expect } from "vitest";
import {
  toOtelTimestamp,
  fromOtelTimestamp,
  GMTDate,
} from "@northguild/gmt-otel";

describe("Timestamp Conversion", () => {
  it("should convert GMTDate to OTel timestamp and back", () => {
    const gmtDate = GMTDate.fromISO("2024-06-01T12:00:00Z");
    const otelTimestamp = toOtelTimestamp(gmtDate);
    const restored = fromOtelTimestamp(otelTimestamp, "UTC");
    expect(restored.toISO()).toBe("2024-06-01T12:00:00Z");
  });

  it("should handle timezone offsets", () => {
    const zoned = fromOtelTimestamp(1717238400000000000n, "Europe/Helsinki");
    expect(zoned.toISO()).toBe("2024-06-01T15:00:00+03:00");
  });
});
```

---

## 📝 README.md Template

````markdown
# @northguild/gmt-otel

> **Timezone-aware OpenTelemetry timestamps and spans for JavaScript.**

[![npm](https://img.shields.io/npm/v/@northguild/gmt-otel)](https://www.npmjs.com/package/@northguild/gmt-otel)
[![License](https://img.shields.io/npm/l/@northguild/gmt-otel)](LICENSE)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

## Features

✅ **Nanosecond-precision timestamps** (OTel standard)
✅ **First-class timezone support** for spans and traces
✅ **Seamless integration** with `@opentelemetry/api` and `@opentelemetry/sdk-trace-node`
✅ **Immutable, predictable** date/time handling (no `Date` object bugs)
✅ **DST/leap second safe**
✅ **Zero dependencies** (except `@northguild/gmt` and OTel core)

## Installation

```bash
pnpm add @northguild/gmt-otel
```
````

## Usage

### Basic Example

```typescript
import { toOtelTimestamp, fromOtelTimestamp } from "@northguild/gmt-otel";
import { GMTDate } from "@northguild/gmt";

const timestamp = toOtelTimestamp(GMTDate.now()); // 1717238400000000000n
const gmtDate = fromOtelTimestamp(timestamp, "Europe/Helsinki");
```

### Timezone-Aware Spans

```typescript
import { startSpan, getSpanLocalTime } from "@northguild/gmt-otel";
import { trace } from "@opentelemetry/api";

const span = startSpan("request", { timezone: "Europe/Helsinki" });
// ... do work ...
span.end();

const localTime = getSpanLocalTime(span, "Europe/Helsinki");
console.log(localTime.toISO()); // "2024-06-01T15:00:00+03:00"
```

## API

See [API Documentation](./docs/API.md) for a full list of functions.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Commit your changes (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feat/your-feature`).
5. Open a Pull Request.

## License

MIT

```

```

---

## 🎯 Next Steps

1. **Scaffold the Package**:

```bash
 pnpm create --template @northguild/package @northguild/gmt-otel
 cd @northguild/gmt-otel
 pnpm add @northguild/gmt @opentelemetry/api @opentelemetry/core
```

1. **Implement Core Functions**:

- Start with `timestamps.ts` (`toOtelTimestamp`, `fromOtelTimestamp`).
- Then `spans.ts` (`startSpan`, `endSpan`).

1. **Write Tests**:

- Use Vitest or Jest to test timestamp conversion and timezone handling.

1. **Document &amp; Publish**:

- Add JSDoc comments and examples in the README.
- Publish to npm under `@northguild/gmt-otel`.

1. **Integrate with Dash0**:

- Prototype with Dash0’s SDK (`dash0-sdk-web`).
- Pitch the package to Dash0’s engineering team.

---

## 💡 Potential Extensions

1. **OTel Metrics Support**:

- Add functions for timezone-aware metrics (e.g., `toOtelMetricTimestamp`).

1. **OTel Logs Support**:

- Extend to logs with `toOtelLogTimestamp`.

1. **Temporal API Integration**:

- Add optional Temporal API support (e.g., `toTemporalInstant`, `fromTemporalInstant`).

1. **React Hooks**:

- Create a `@northguild/gmt-otel-react` package with hooks for timezone-aware tracing in React apps.

---

## 📌 Notes

- **Naming Conventions**: Use `camelCase` for functions and `PascalCase` for types.
- **Error Handling**: Throw descriptive errors for invalid inputs (e.g., invalid timezone or timestamp).
- **Performance**: Avoid unnecessary allocations (e.g., reuse objects where possible).
- **Compatibility**: Support both Node.js and browser environments.
