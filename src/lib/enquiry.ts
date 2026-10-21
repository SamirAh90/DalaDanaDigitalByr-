import { z } from "zod";

const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((value) => !/[\r\n]/.test(value) && !value.includes("\u0000"));

/** Shared size limits; validation is always repeated on the server. */
export const enquirySchema = z
  .object({
    requestId: z.string().uuid(),
    source: z.enum(["contact", "meeting"]),
    name: singleLine(100).pipe(z.string().min(2)),
    company: singleLine(160),
    email: singleLine(254)
      .pipe(z.string().email())
      .transform((value) => value.toLowerCase()),
    phone: singleLine(80),
    service: singleLine(100),
    message: z
      .string()
      .trim()
      .min(10)
      .max(5000)
      .refine((value) => !value.includes("\u0000")),
    website: z.string().max(200),
    startedAt: z.number().int().positive(),
    quote: z.unknown().optional(),
  })
  .strict();

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryResult =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "validation" | "spam" | "rate_limit" | "unavailable" | "delivery" | "conflict";
      message: string;
    };
