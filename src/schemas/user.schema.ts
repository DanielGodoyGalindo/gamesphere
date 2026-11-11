import { z } from "zod";

// https://zod.dev/api#objects

export const createUserSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  email: z.email("Invalid email").trim()
});

export const updateUserSchema = createUserSchema.partial();