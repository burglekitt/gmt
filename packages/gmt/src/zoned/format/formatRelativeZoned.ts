import { Temporal } from "@js-temporal/polyfill";
import { isValidUtc } from "../../utc/validate";
import { isValidZonedDateTime } from "../validate";

// Intl.RelativeTimeFormatUnit includes "quarter" which Temporal doesn't support.
type RelativeUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second";

export interface FormatRelativeZonedOptions {
  style?: "long" | "short" | "narrow";
  numeric?: "always" | "auto";
  largestUnit?: RelativeUnit;
  // A ZonedDateTime ISO string, a UTC ISO string, or a unix epoch (ms).
  // When omitted, "now" in the value's own timezone is used.
  reference?: string | number;
}

const AUTO_UNITS: Array<{ unit: RelativeUnit; maxSeconds: number }> = [
  { unit: "second", maxSeconds: 60 },
  { unit: "minute", maxSeconds: 3_600 },
  { unit: "hour", maxSeconds: 86_400 },
  { unit: "day", maxSeconds: Infinity },
];

export function formatRelativeZoned(
  value: string,
  locale?: string,
  options: FormatRelativeZonedOptions = {},
): string {
  if (!isValidZonedDateTime(value)) return "";

  // String reference must be a valid ZonedDateTime or UTC ISO string.
  if (
    typeof options.reference === "string" &&
    !isValidZonedDateTime(options.reference) &&
    !isValidUtc(options.reference)
  )
    return "";

  if (
    typeof options.reference === "number" &&
    !Number.isFinite(options.reference)
  )
    return "";

  try {
    const valueZDT = Temporal.ZonedDateTime.from(value);
    const valueInstant = valueZDT.toInstant();

    let refZDT: Temporal.ZonedDateTime;
    if (options.reference == null) {
      // "now" in value's own zone — keeps the calendar context consistent.
      refZDT = Temporal.Now.zonedDateTimeISO(valueZDT.timeZoneId);
    } else if (typeof options.reference === "string") {
      // UTC string → place into value's zone for a consistent calendar anchor.
      // ZonedDateTime string → keep its own zone; Temporal handles cross-zone diffs.
      refZDT = options.reference.endsWith("Z")
        ? Temporal.Instant.from(options.reference).toZonedDateTimeISO(
            valueZDT.timeZoneId,
          )
        : Temporal.ZonedDateTime.from(options.reference);
    } else {
      // Numeric epoch (ms) → place into value's zone.
      refZDT = Temporal.Instant.fromEpochMilliseconds(
        options.reference,
      ).toZonedDateTimeISO(valueZDT.timeZoneId);
    }

    const diff = valueInstant.since(refZDT.toInstant());
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
      amount = Math.round(diff.total({ unit, relativeTo: refZDT }));
    }

    return new Intl.RelativeTimeFormat(locale, {
      numeric: options.numeric ?? "auto",
      style: options.style ?? "long",
    }).format(amount, unit);
  } catch {
    return "";
  }
}
