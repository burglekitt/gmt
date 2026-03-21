import { convertZonedToUnix } from "./convertZonedToUnix";

export function convertZonedToUnixMilliseconds(value: string): number | null {
  return convertZonedToUnix(value, "milliseconds");
}
