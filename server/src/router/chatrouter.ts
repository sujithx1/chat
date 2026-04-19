import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { createChatController } from "../controller/chat/create-chat.controller";



export const chatrouter=new Hono();

  chatrouter.use("*",authMiddleware);

  chatrouter.post("/",createChatController)