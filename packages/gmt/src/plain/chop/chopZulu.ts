import { isZuluDateTime } from "../validate/isZuluDateTime";

export function chopZulu(value: string): string {
  if (!isZuluDateTime(value)) {
    return "";
  }

  // only shaves off z or Z at the end of the string, if it exists
  return value.replace(/z$/i, "");
}
