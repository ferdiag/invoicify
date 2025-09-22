import z from "zod/v4";

export const Money = z
  .number()
  .nonnegative()
  .refine((v) => Math.round(v * 100) === v * 100, "Maximal zwei Nachkommastellen.");
