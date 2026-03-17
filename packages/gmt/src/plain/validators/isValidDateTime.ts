import { Temporal } from "@js-temporal/polyfill";
import { plainDateTime } from "../../regex";

export function isValidDateTime(value: string): boolean {
  if (!plainDateTime.test(value)) {
    return false;
  }

  try {
    Temporal.PlainDateTime.from(value);
    return true;
  } catch {
    return false;
  }
}
