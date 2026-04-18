// src/modules/auth/auth.routes.ts
import { Hono } from "hono";
import { register } from "../controller/auth/register-controller";
import { LoginUserController } from "../controller/auth/login-controller";

export const authRoutes = new Hono();

authRoutes.post("/register", register);
authRoutes.post("/login", LoginUserController);
