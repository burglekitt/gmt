import { isZuluDateTime } from "../validate/isZuluDateTime";

/**
 * Extracts only the date part from a Zulu (UTC) datetime string.
 * Useful when frontenders provide UTC datetimes but they should be treated as plain dates.
 * @param value A Zulu datetime string (e.g. "2024-03-17T12:00:00Z")
 * @returns Just the date part (e.g. "2024-03-17")
 * @throws If the input is not a valid Zulu datetime
 */
export function chopZulu(value: string): string {
  if (!isZuluDateTime(value)) {
    throw new Error(`Not a valid Zulu datetime: ${value}`);
  }
  // Extract the date part (before the 'T'). Since isZuluDateTime validates,
  // we know the format is valid and contains a 'T'.
  return value.substring(0, value.indexOf("T"));
}
