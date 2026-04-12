import { Temporal } from "@js-temporal/polyfill";
import { isValidDate } from "../validate";

/**
 * Sort an array of PlainDate values in ascending or descending order.
 *
 * - Returns empty array if input is empty or contains no valid dates.
 * - Validation is performed on each item in the array.
 *
 * @param dates Array of ISO PlainDate strings (e.g. "2024-03-10")
 * @param order "asc" for ascending (earliest first) | "desc" for descending (latest first)
 * @returnsSorted array of date strings
 */
export function sortDates(
  dates: string[],
  order: "asc" | "desc" = "asc",
): string[] {
  if (!dates.length) return [];

  const valid = dates.filter(isValidDate);
  if (!valid.length) return [];

  const comparables = valid.map((d) => Temporal.PlainDate.from(d));
  comparables.sort(Temporal.PlainDate.compare);

  if (order === "desc") {
    return comparables.reverse().map((d) => d.toString());
  }

  return comparables.map((d) => d.toString());
}
