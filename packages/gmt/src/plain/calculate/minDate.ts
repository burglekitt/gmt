import { Temporal } from "@js-temporal/polyfill";
import { isValidDate } from "../validate";

/**
 * Return the earliest (minimum) of the given PlainDate values.
 *
 * @param dates Array of ISO PlainDate strings (e.g. "2024-03-10")
 * @returns The earliest date string, or null on invalid input
 * 
 * @example minDate(["2024-03-10", "2024-03-15", "2024-03-12"]) // "2024-03-10"
 * @example minDate(["invalid", "2024-03-15", "2024-03-12"]) // "2024-03-12"
 * @example minDate(["invalid", "also invalid"]) // null
 * @example minDate([]) // null
 */
export function minDate(dates: string[]): string | null {
  if (!dates.length) return null;

  const valid = dates.filter(isValidDate);
  if (!valid.length) return null;

  try {
    const comparables = valid.map((d) => Temporal.PlainDate.from(d));
    comparables.sort(Temporal.PlainDate.compare);

    return comparables[0].toString();
  } catch {
    return null;
  }
}
