// src/modules/auth/auth.schema.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
  phone: z.string().min(10).max(10),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});