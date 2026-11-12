import { z } from "zod";

// https://zod.dev/api#nullables

export const createGameSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  description: z.string().trim().nullable().optional(),
  cover: z.string().trim().nullable().optional(),
  releaseDate: z.string().trim().min(1).pipe(z.coerce.date()).nullable().optional(),
  rating: z.number().min(0).max(10).nullable().optional()
});

export const updateGameSchema = createGameSchema.partial();