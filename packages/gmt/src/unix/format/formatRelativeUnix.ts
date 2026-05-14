import { Temporal } from "@js-temporal/polyfill";
import {
  type FormatRelativeOptions,
  formatRelativeTemporal,
  mapLargestUnit,
  parseEpochNumber,
  resolveReferenceToZoned,
} from "../../internal/formatHelpers";
import { normalizeTimeZone } from "../../internal/normalizeTimeZone";
import {
  isValidUnixMilliseconds,
  isValidUnixSeconds,
  isValidUnixUnit,
} from "../validate";

interface Options extends FormatRelativeOptions {
  epochUnit?: "seconds" | "milliseconds";
  timeZone?: string | "local";
  reference?: string | number;
}

/**
 * Return a localized relative time string for a Unix epoch input using Intl options.
 *
 * - Accepts `value` as a number or numeric string. Use `options.epochUnit` to indicate "seconds" or "milliseconds".
 * - `options.reference` may be a UTC ISO string or an epoch number (interpreted according to `options.epochUnit`, milliseconds by default).
 * - `timeZone: "local"` is resolved via the internal `getSystemTimeZone()` helper; invalid time zones fall back to "UTC".
 * - Returns `""` on invalid input.
 *
 * @param value Unix epoch as number or numeric string
 * @param locale optional BCP 47 locale identifier
 * @param options optional FormatRelativeOptions with additional `epochUnit`, `timeZone`, and `reference` properties
 * @returns localized relative time string or "" on invalid input
 *
 * @example formatRelativeUnix(1714531200000, "en-US", { reference: 1714617600000 }) // "yesterday" (numeric: "auto")
 * @example formatRelativeUnix(1714531200000, "en-US", { reference: 1714617600000, numeric: "always" }) // "1 day ago"
 * @example formatRelativeUnix(1714531200, "en-US", { epochUnit: "seconds", reference: 1714617600 }) // "yesterday"
 * @example formatRelativeUnix(1714531200, "en-US", { epochUnit: "seconds", reference: 1714617600, numeric: "always" }) // "1 day ago"
 * @example formatRelativeUnix(1714531200000, "en-US", { reference: "2024-05-01T13:00:00Z" }) // "hour"
 * @example formatRelativeUnix(1714531200000, "en-US", { timeZone: "Europe/Paris", reference: 1714617600000 }) // "yesterday"
 * @example formatRelativeUnix(1714531200000, "en-US", { timeZone: "local", reference: 1714617600000 }) // resolves local zone then formats
 * @example formatRelativeUnix("invalid") // ""
 */
export function formatRelativeUnix(
  value: string | number,
  locale?: string,
  options?: Options,
): string {
  const {
    epochUnit = "milliseconds",
    timeZone,
    reference,
    ...opts
  } = options ?? {};

  if (!isValidUnixUnit(epochUnit)) return "";

  const epochNum = parseEpochNumber(value);
  if (epochNum === null) return "";

  if (
    (epochUnit === "milliseconds" && !isValidUnixMilliseconds(epochNum)) ||
    (epochUnit === "seconds" && !isValidUnixSeconds(epochNum))
  )
    return "";

  const tz = normalizeTimeZone(timeZone as string | undefined);

  try {
    const mappedLargest = mapLargestUnit(
      (opts as Record<string, unknown>).largestUnit as unknown as
        | string
        | undefined,
    );
    if (mappedLargest === null) return "";
    const finalOpts: FormatRelativeOptions = {
      ...(opts as FormatRelativeOptions),
      ...(mappedLargest ? { largestUnit: mappedLargest } : {}),
    };

    const instant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? epochNum * 1000 : epochNum,
    );
    const zoned = instant.toZonedDateTimeISO(tz);

    const ref = resolveReferenceToZoned(reference, epochUnit, tz);

    return formatRelativeTemporal(
      zoned,
      ref,
      locale,
      finalOpts as FormatRelativeOptions,
    );
  } catch {
    return "";
  }
}
