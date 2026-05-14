import { InferInsertModel } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UserSchema } from './db/schema';
import { errorHandler } from './middleware/error-middleware';
import { api } from './router';
import wsHandler from './ws/ws.handler';
export type userTypes=InferInsertModel<typeof UserSchema>
type Env = {
  Variables: {
    user: userTypes;
  };
};

export const HonoCtxKey = {
  AuthUser: 'user',
};
const app = new Hono<Env>()

app.use(logger())
app.use("*",cors())

app.route('/api/v1', api);



app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.onError((err, c) => errorHandler(err, c));


const server = Bun.serve({
  port: 3000,

  fetch(req, server) {
    // 👇 handle websocket upgrade
    if (req.url.includes("/ws")) {
      return wsHandler(req, server);
    }

    return app.fetch(req);
  },

  websocket: {
    open(ws) {
      ws.data.onOpen?.(ws);
    },
    message(ws, message) {
      ws.data.onMessage?.(ws, message);
    },
    close(ws) {
      ws.data.onClose?.(ws);
    },,
  },
});
