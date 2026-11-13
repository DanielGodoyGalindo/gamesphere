import { z } from "zod";
import { LibraryStatus } from "@/generated/prisma/client";

// https://zod.dev/api

export const createLibrarySchema = z.object({
  userId: z.number().int().positive(),
  gameId: z.number().int().positive(),
  status: z.enum(LibraryStatus).optional(),
  progress: z.number().int().min(0).max(100).optional()
});

export const updateLibrarySchema = createLibrarySchema
  .omit({ userId: true, gameId: true })
  .partial();