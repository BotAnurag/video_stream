import { z } from "zod";

export const createUserDto = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});
