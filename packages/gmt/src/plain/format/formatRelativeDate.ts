import { Temporal } from "@js-temporal/polyfill";
import {
  type FormatRelativeOptions,
  formatRelativeTemporal,
  mapLargestUnit,
} from "../../internal/formatHelpers";
import { isValidDate } from "../validate";

interface Options extends FormatRelativeOptions {
  /** Optional ISO PlainDate reference to compare against (e.g. "2024-05-02") */
  reference?: string;
}

export function formatRelativeDate(
  value: string,
  locale?: string,
  options?: Options,
): string {
  if (!isValidDate(value)) return "";

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

    const target = Temporal.PlainDate.from(value);
    const ref = reference
      ? Temporal.PlainDate.from(reference)
      : Temporal.Now.plainDateISO();

    return formatRelativeTemporal(target, ref, locale, finalOpts);
  } catch {
    return "";
  }
}
