// src/ws/ws.handler.ts
import { verifyToken } from "../lib/jwt";
import { addConnection, removeConnection } from "./ws.manager";

export default function wsHandler(req: Request, server: any) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let userId: string;

  try {
    const payload = verifyToken(token);
    userId = payload.userId;
  } catch {
    return new Response("Invalid token", { status: 401 });
  }

  const upgraded = server.upgrade(req, {
    data: {
      userId,

      onOpen(ws: any) {
        console.log("WS connected:", userId);
        addConnection(userId, ws);
      },

      onClose(ws: any) {
        console.log("WS disconnected:", userId);
        removeConnection(userId, ws);
      },

      onMessage(ws: any, message: string) {
        console.log("Client:", message);
      },
    },
  });

  if (!upgraded) {
    return new Response("Upgrade failed", { status: 400 });
  }
}