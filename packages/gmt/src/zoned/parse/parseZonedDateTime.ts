import { Temporal } from "@js-temporal/polyfill";
import { isLeapSecond } from "../../plain/validate/isLeapSecond";
import { isValidZonedDateTime } from "../validate/isValidZonedDateTime";

export const parseZonedDateTime = (
  value: string,
): Temporal.ZonedDateTime | string => {
  if (!isValidZonedDateTime(value) || isLeapSecond(value)) {
    return "";
  }

  try {
    return Temporal.ZonedDateTime.from(value).toPlainDateTime().toString();
  } catch {
    return "";
  }
};
