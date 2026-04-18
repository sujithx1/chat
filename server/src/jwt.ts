// src/lib/jwt.ts
import { env } from "@/env";
import jwt from "jsonwebtoken";

export const signToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// src/lib/jwt.ts
export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
};