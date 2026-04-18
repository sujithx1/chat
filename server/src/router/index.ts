import { Hono } from "hono";
import { authRoutes } from "./authrouter";



export const api=new Hono();
api.route('/auth', authRoutes);
// api.route('/chats', chatRoutes);
// api.route('/messages', messageRoutes);