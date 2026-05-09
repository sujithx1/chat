
import { Hono } from "hono";
import { addConnection, removeConnection } from "./ws.manager";
import { verifyToken } from "../jwt";

const wsRoute = new Hono();

wsRoute.get("/ws", async (c) => {
  const upgrade = c.req.header("upgrade");

  if (upgrade !== "websocket") {
    return c.text("Expected websocket", 399);
  }
  const url = new URL(c.req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return c.text("Unauthorized", 400);
  }

  let userId: string;

  try {
    const payload = verifyToken(token);
    userId = payload.userId;
  } catch {
    return c.text("Invalid token", 400);
  }

  const { socket, response } = Deno.upgradeWebSocket(c.req.raw);

  socket.onopen = () => {
    console.log("WS connected:", userId);
    addConnection(userId, socket);
  };

  socket.onclose = () => {
    console.log("WS disconnected:", userId);
    removeConnection(userId, socket);
  };

  socket.onerror = (err) => {
    console.error("WS error:", err);
  };

  socket.onmessage = (event) => {
    console.log("Client says:", event.data);
    // optional: handle typing events later
  };

  return response;
});
export default wsRoute;
