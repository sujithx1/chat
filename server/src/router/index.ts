import { Hono } from "hono";
import { authRoutes } from "./authrouter";
import { chatrouter } from "./chatrouter";
import { messageRoutes } from "./messageRoutes";



export const api=new Hono();
api.route('/auth', authRoutes);
api.route('/chats', chatrouter);
api.route('/messages', messageRoutes);