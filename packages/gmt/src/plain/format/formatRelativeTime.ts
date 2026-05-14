import { Temporal } from "@js-temporal/polyfill";
import {
  type FormatRelativeOptions,
  formatRelativeTemporal,
  mapLargestUnit,
} from "../../internal/formatHelpers";
import { isValidTime } from "../validate";

interface Options extends FormatRelativeOptions {
  /** Optional ISO PlainDateTime reference to compare against (e.g. "2024-05-02T13:00:00") */
  reference?: string;
}

/**
 * Return a localized relative time string for a PlainTime input.
 *
 * - Combines the provided `value` (PlainTime) with either the provided
 *   `options.reference` date (ISO PlainDateTime) or the current local date
 *   to produce a `Temporal.PlainDateTime` target.
 * - Calls `formatRelativeTemporal` to produce the localized phrase.
 * - Returns "" on invalid input or error.
 */
export function formatRelativeTime(
  value: string,
  locale?: string,
  options?: Options,
): string {
  if (!isValidTime(value)) return "";

  try {
    const { reference, ...opts } = options ?? {};

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

    // Build target PlainDateTime by combining a date with the provided time.
    const dateComponent = reference
      ? String(reference).includes("T")
        ? String(reference).split("T")[0]
        : String(reference)
      : Temporal.Now.plainDateISO().toString();

    const target = Temporal.PlainDateTime.from(`${dateComponent}T${value}`);
    const ref = reference
      ? Temporal.PlainDateTime.from(reference)
      : Temporal.Now.plainDateTimeISO();

    return formatRelativeTemporal(target, ref, locale, finalOpts);
  } catch {
    return "";
  }
}
