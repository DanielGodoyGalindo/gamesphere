import { z } from "zod";

// https://zod.dev/api

export const createReviewSchema = z.object({
  userId: z.number().int().positive(),
  gameId: z.number().int().positive(),
  rating: z.number().int().min(1).max(10),
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required")
});

export const updateReviewSchema = createReviewSchema
  .omit({ userId: true, gameId: true })
  .partial();