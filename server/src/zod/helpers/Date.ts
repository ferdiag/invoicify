import z from "zod/v4";

export const YMD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD");
