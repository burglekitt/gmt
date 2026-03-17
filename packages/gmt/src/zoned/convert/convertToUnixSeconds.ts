import { convertToUnixMilliseconds } from "./convertToUnixMilliseconds";

export function convertToUnixSeconds(value: string): number {
  return Math.floor(convertToUnixMilliseconds(value) / 1000);
}
