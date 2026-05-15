import { Temporal } from "@js-temporal/polyfill";
import { normalizeTimeZone } from "../../internal/normalizeTimeZone";
import { isValidUtc } from "../../utc/validate";

// Intl.RelativeTimeFormatUnit includes "quarter" which Temporal doesn't support.
type RelativeUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second";

export interface FormatRelativeUnixOptions {
  style?: "long" | "short" | "narrow";
  numeric?: "always" | "auto";
  largestUnit?: RelativeUnit;
  epochUnit?: "milliseconds" | "seconds";
  reference?: string | number;
  timeZone?: string;
}

const AUTO_UNITS: Array<{ unit: RelativeUnit; maxSeconds: number }> = [
  { unit: "second", maxSeconds: 60 },
  { unit: "minute", maxSeconds: 3_600 },
  { unit: "hour", maxSeconds: 86_400 },
  { unit: "day", maxSeconds: Infinity },
];

function toInstant(
  raw: string | number,
  epochUnit: "milliseconds" | "seconds",
): Temporal.Instant | null {
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!Number.isFinite(n)) return null;
  try {
    const ms = epochUnit === "seconds" ? n * 1000 : n;
    return Temporal.Instant.fromEpochMilliseconds(ms);
  } catch {
    return null;
  }
}

export function formatRelativeUnix(
  value: string | number,
  locale?: string,
  options: FormatRelativeUnixOptions = {},
): string {
  const epochUnit = options.epochUnit ?? "milliseconds";

  const target = toInstant(value, epochUnit);
  if (target === null) return "";

  let reference: Temporal.Instant;
  if (options.reference === undefined) {
    try {
      reference = Temporal.Now.instant();
    } catch {
      return "";
    }
  } else if (typeof options.reference === "string") {
    if (!isValidUtc(options.reference)) return "";
    try {
      reference = Temporal.Instant.from(options.reference);
    } catch {
      return "";
    }
  } else {
    const ref = toInstant(options.reference, epochUnit);
    if (ref === null) return "";
    reference = ref;
  }

  const tz = normalizeTimeZone(options.timeZone);

  try {
    const diff = target.since(reference);
    const absSeconds = Math.abs(diff.total("second"));

    const unit =
      options.largestUnit ??
      AUTO_UNITS.find((t) => absSeconds < t.maxSeconds)?.unit ??
      "day";

    let amount: number;
    try {
      amount = Math.round(diff.total(unit));
    } catch {
      // month/year are calendrical and need a relativeTo anchor
      amount = Math.round(
        diff.total({ unit, relativeTo: reference.toZonedDateTimeISO(tz) }),
      );
    }

    return new Intl.RelativeTimeFormat(locale, {
      numeric: options.numeric ?? "auto",
      style: options.style ?? "long",
    }).format(amount, unit);
  } catch {
    return "";
  }
}
