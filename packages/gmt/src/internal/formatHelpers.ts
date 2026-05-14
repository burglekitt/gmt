import { Temporal } from "@js-temporal/polyfill";
import { isValidDateTimeDurationUnit } from "../plain/validate/isValidDateTimeDurationUnit";
import { getUnixNow } from "../unix/get/getUnixNow";
import { normalizeDateTime } from "./normalizeDateTime";

export interface FormatRelativeOptions {
  numeric?: "auto" | "always";
  style?: "long" | "short" | "narrow";
  largestUnit?:
    | "year"
    | "month"
    | "week"
    | "day"
    | "hour"
    | "minute"
    | "second";
}

export const mapLargestUnit = (
  raw?: string,
): FormatRelativeOptions["largestUnit"] | undefined | null => {
  if (raw === undefined) return undefined;
  const singularAllowed = [
    "year",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
  ];

  if (singularAllowed.includes(raw))
    return raw as FormatRelativeOptions["largestUnit"];

  if (isValidDateTimeDurationUnit(raw)) {
    const mapping: Record<string, FormatRelativeOptions["largestUnit"]> = {
      years: "year",
      months: "month",
      weeks: "week",
      days: "day",
      hours: "hour",
      minutes: "minute",
      seconds: "second",
      milliseconds: "second",
      microseconds: "second",
      nanoseconds: "second",
    };
    return mapping[raw as keyof typeof mapping];
  }

  // invalid unit
  return null;
};

export const parseEpochNumber = (value: string | number): number | null => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return null;
    return Number(trimmed);
  }
  return null;
};

export const resolveReferenceToZoned = (
  reference: string | number | undefined,
  epochUnit: "seconds" | "milliseconds" = "milliseconds",
  tz = "UTC",
): Temporal.ZonedDateTime => {
  if (reference === undefined) {
    return Temporal.Now.instant().toZonedDateTimeISO(tz);
  }

  if (typeof reference === "number") {
    const ms = epochUnit === "seconds" ? reference * 1000 : reference;
    return Temporal.Instant.fromEpochMilliseconds(ms).toZonedDateTimeISO(tz);
  }

  try {
    return Temporal.Instant.from(reference as string).toZonedDateTimeISO(tz);
  } catch (e) {
    try {
      // If Instant parsing fails, try parsing as a ZonedDateTime (may include
      // bracketed IANA zone like +00:00[Europe/London]). Convert to Instant
      // then re-zone to the requested tz.
      const z = Temporal.ZonedDateTime.from(reference as string);
      return z.toInstant().toZonedDateTimeISO(tz);
    } catch (err) {
      // Debug log to help identify malformed reference inputs in tests.
      // eslint-disable-next-line no-console
      console.error(
        "resolveReferenceToZoned: failed to parse reference:",
        reference,
        e,
        err,
      );
      throw err;
    }
  }
};

export const getLocalizedTimeZoneName = (
  locale?: string,
  timeZone?: string,
  tzNameOption?: Intl.DateTimeFormatOptions["timeZoneName"],
  epochMs?: number,
): string => {
  try {
    if (!timeZone) return "";
    const nameOpt =
      tzNameOption ?? ("long" as Intl.DateTimeFormatOptions["timeZoneName"]);
    const dtf = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: nameOpt,
    });
    const dateValue =
      epochMs === undefined ? getUnixNow("milliseconds") : Number(epochMs);
    const parts = dtf.formatToParts(dateValue as unknown as Date | number);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart ? tzPart.value : "";
  } catch {
    return "";
  }
};

/**
 * Format a relative time string between two Temporal values.
 *
 * - `reference.since(target)` is used to compute the duration.
 * - Chooses a sensible unit (second/minute/hour/day) and formats using
 *   `Intl.RelativeTimeFormat`.
 * - Returns "" on invalid input or on error.
 */
export function formatRelativeTemporal(
  target:
    | Temporal.PlainDate
    | Temporal.PlainDateTime
    | Temporal.ZonedDateTime
    | Temporal.Instant,
  reference:
    | Temporal.PlainDate
    | Temporal.PlainDateTime
    | Temporal.ZonedDateTime
    | Temporal.Instant,
  locale?: string,
  opts?: FormatRelativeOptions,
): string {
  try {
    const numeric = opts?.numeric ?? "auto";
    const style = opts?.style ?? "long";

    // Compute a duration: reference.since(target)
    // Use the runtime objects' since() method (works for Instant/ZonedDateTime/PlainDate)
    const durObj = (
      reference as unknown as {
        since: (t: unknown) => { total: (opts: { unit: string }) => number };
      }
    ).since(target) as { total: (opts: { unit: string }) => number };

    const seconds = Math.abs(durObj.total({ unit: "second" }));

    const candidates: {
      unit: FormatRelativeOptions["largestUnit"];
      limit: number;
    }[] = [
      { unit: "second", limit: 60 },
      { unit: "minute", limit: 3600 },
      { unit: "hour", limit: 86400 },
      { unit: "day", limit: Infinity },
    ];

    // choose unit based on seconds threshold; this avoids chained else/ifs
    const defaultChosenUnit =
      candidates.find((c) => seconds < c.limit)?.unit ?? "day";

    const chosenUnit =
      (opts?.largestUnit as FormatRelativeOptions["largestUnit"]) ??
      (defaultChosenUnit as FormatRelativeOptions["largestUnit"]);

    const value = Math.round(durObj.total({ unit: chosenUnit as string }));

    const rtf = new Intl.RelativeTimeFormat(locale ?? "en-US", {
      numeric,
      style,
    });

    // rtf expects the value in the sign convention: positive => future
    // we computed reference.since(target) so positive means target is in the past.
    // To get human phrase like "1 day ago" for positive duration, pass -value.
    const numeric = opts?.numeric ?? "auto";
    const style = opts?.style ?? "long";

    // Compute a duration: reference.since(target)
    // Use the runtime objects' since() method (works for Instant/ZonedDateTime/PlainDate)
    let durObj: { total: (opts: { unit: string }) => number };
    try {
      durObj = (
        reference as unknown as {
          since: (t: unknown) => { total: (opts: { unit: string }) => number };
        }
      ).since(target) as { total: (opts: { unit: string }) => number };
    } catch (e) {
      // If computing the duration fails, we cannot produce a relative string.
      // eslint-disable-next-line no-console
      console.error("formatRelativeTemporal: failed to compute duration:", e, {
        target: typeof (target as any)?.toString === "function" ? (target as any).toString() : typeof target,
        reference: typeof (reference as any)?.toString === "function" ? (reference as any).toString() : typeof reference,
        locale,
        opts,
      });
      return "";
    }

    const seconds = Math.abs(durObj.total({ unit: "second" }));

    const candidates: {
      unit: FormatRelativeOptions["largestUnit"];
      limit: number;
    }[] = [
      { unit: "second", limit: 60 },
      { unit: "minute", limit: 3600 },
      { unit: "hour", limit: 86400 },
      { unit: "day", limit: Infinity },
    ];

    // choose unit based on seconds threshold; this avoids chained else/ifs
    const defaultChosenUnit = candidates.find((c) => seconds < c.limit)?.unit ?? "day";

    const chosenUnit = (opts?.largestUnit as FormatRelativeOptions["largestUnit"]) ?? (defaultChosenUnit as FormatRelativeOptions["largestUnit"]);

    const value = Math.round(durObj.total({ unit: chosenUnit as string }));

    try {
      const rtf = new Intl.RelativeTimeFormat(locale ?? "en-US", {
        numeric,
        style,
      });

      // rtf expects the value in the sign convention: positive => future
      // we computed reference.since(target) so positive means target is in the past.
      // To get human phrase like "1 day ago" for positive duration, pass -value.
      const out = rtf.format(-value, chosenUnit as unknown as Intl.RelativeTimeFormatUnit);
      return normalizeDateTime(out);
    } catch (e) {
      // If Intl fails for a locale/environment, fall back to a simple English-ish
      // fallback so callers still receive a non-empty string. Log details for
      // debugging and then return a sensible fallback.
      // eslint-disable-next-line no-console
      console.error("formatRelativeTemporal Intl error, falling back:", e, { locale, opts, chosenUnit, value });
      const fallback = `${Math.abs(value)} ${chosenUnit}${Math.abs(value) !== 1 ? "s" : ""}`;
      return normalizeDateTime(fallback);
    }
