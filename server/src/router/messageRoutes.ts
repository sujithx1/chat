import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth-middleware";
import { SendMessageController } from "../controller/message/sendmessagecontroller";








export const messageRoutes=new Hono();

messageRoutes.use("*",authMiddleware);
messageRoutes.post("/",SendMessageController)