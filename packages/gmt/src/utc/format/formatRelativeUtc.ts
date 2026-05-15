import { Temporal } from "@js-temporal/polyfill";
import { normalizeTimeZone } from "../../internal/normalizeTimeZone";
import { isValidUtc } from "../validate";

// Intl.RelativeTimeFormatUnit includes "quarter" which Temporal doesn't support.
type RelativeUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second";

export interface FormatRelativeUtcOptions {
  style?: "long" | "short" | "narrow";
  numeric?: "always" | "auto";
  largestUnit?: RelativeUnit;
  reference?: string;
  timeZone?: string;
}

const AUTO_UNITS: Array<{
  unit: RelativeUnit;
  maxSeconds: number;
}> = [
  { unit: "second", maxSeconds: 60 },
  { unit: "minute", maxSeconds: 3_600 },
  { unit: "hour", maxSeconds: 86_400 },
  { unit: "day", maxSeconds: Infinity },
];

// date-only UTC strings ("2024-01-01Z") are valid but Temporal.Instant.from
// won't accept them; treat them as midnight UTC.
function toInstant(utcString: string): Temporal.Instant {
  try {
    return Temporal.Instant.from(utcString);
  } catch {
    return Temporal.PlainDate.from(utcString.replace(/Z$/i, ""))
      .toZonedDateTime("UTC")
      .toInstant();
  }
}

export function formatRelativeUtc(
  value: string,
  locale?: string,
  options: FormatRelativeUtcOptions = {},
): string {
  if (!isValidUtc(value)) return "";
  if (options.reference !== undefined && !isValidUtc(options.reference))
    return "";

  try {
    const target = toInstant(value);
    const reference = options.reference
      ? toInstant(options.reference)
      : Temporal.Now.instant();

    const tz = normalizeTimeZone(options.timeZone);

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
