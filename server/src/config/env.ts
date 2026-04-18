// src/config/env.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
      JWT_SECRET: z.string().min(1),
      NODE_ENV: z.enum(["development", "test", "production"]),
  },
  runtimeEnv: process.env,  
})
export const isDevMode = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
;