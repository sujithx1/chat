// src/ws/ws.manager.ts

type Socket = WebSocket;

const userSockets = new Map<string, Set<Socket>>();

export const addConnection = (userId: string, socket: Socket) => {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId)!.add(socket);
};

export const removeConnection = (userId: string, socket: Socket) => {
  userSockets.get(userId)?.delete(socket);
};

export const sendToUser = (userId: string, data: any) => {
  const sockets = userSockets.get(userId);

  if (!sockets) return;

  for (const ws of sockets) {
    ws.send(JSON.stringify(data));
  }
};