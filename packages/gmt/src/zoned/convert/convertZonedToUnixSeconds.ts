import { convertZonedToUnix } from "./convertZonedToUnix";

export function convertZonedToUnixSeconds(value: string): number | null {
  return convertZonedToUnix(value, "seconds");
}
