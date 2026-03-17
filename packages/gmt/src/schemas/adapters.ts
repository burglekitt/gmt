import { z } from "zod";

import {
  dateStringSchema,
  dateTimeStringSchema,
  timeStringSchema,
  timeZoneStringSchema,
} from "./core";

const optionalInputStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value == null) {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  });

export const optionalDateStringSchema = optionalInputStringSchema.pipe(
  dateStringSchema.optional(),
);

export const optionalTimeStringSchema = optionalInputStringSchema.pipe(
  timeStringSchema.optional(),
);

export const optionalDateTimeStringSchema = optionalInputStringSchema.pipe(
  dateTimeStringSchema.optional(),
);

export const optionalTimeZoneStringSchema = optionalInputStringSchema.pipe(
  timeZoneStringSchema.optional(),
);
