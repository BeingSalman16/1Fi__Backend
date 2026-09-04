import { z } from "zod";

export const productListSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({
    search: z.string().max(80).optional().default(""),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12)
  })
});

export const productSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/)
  }),
  query: z.object({}),
  body: z.object({})
});
