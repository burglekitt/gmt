import { z } from "zod";

import { isValidDate, isValidDateTime, isValidTime } from "../plain/validate";
import { plainDate, plainDateTime, plainTime, timezone } from "../regex";
import { isValidTimeZone } from "../zoned/validate";

export const dateStringSchema = z
  .string()
  .regex(plainDate, "Date must match ISO 8601 calendar date format")
  .refine(isValidDate, "Date is not a valid calendar date");

export const timeStringSchema = z
  .string()
  .regex(plainTime, "Time must match ISO 8601 local time format")
  .refine(isValidTime, "Time is not valid");

export const dateTimeStringSchema = z
  .string()
  .regex(plainDateTime, "Date-time must match ISO 8601 local date-time format")
  .refine(isValidDateTime, "Date-time is not valid");

export const timeZoneStringSchema = z
  .string()
  .regex(timezone, "Timezone must be an IANA timezone string")
  .refine(isValidTimeZone, "Timezone is not valid");

export type DateString = z.infer<typeof dateStringSchema>;
export type TimeString = z.infer<typeof timeStringSchema>;
export type DateTimeString = z.infer<typeof dateTimeStringSchema>;
export type TimeZoneString = z.infer<typeof timeZoneStringSchema>;
