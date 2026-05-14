import { Temporal } from "@js-temporal/polyfill";
import {
  type FormatRelativeOptions,
  formatRelativeTemporal,
  mapLargestUnit,
} from "../../internal/formatHelpers";
import { isValidDateTime } from "../validate";

interface Options extends FormatRelativeOptions {
  /** Optional ISO PlainDateTime reference to compare against (e.g. "2024-05-02T13:00:00") */
  reference?: string;
}

export function formatRelativeDateTime(
  value: string,
  locale?: string,
  options?: Options,
): string {
  if (!isValidDateTime(value)) return "";

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

    const target = Temporal.PlainDateTime.from(value);
    const ref = reference
      ? Temporal.PlainDateTime.from(reference)
      : Temporal.Now.plainDateTimeISO();

    return formatRelativeTemporal(target, ref, locale, finalOpts);
  } catch {
    return "";
  }
}
