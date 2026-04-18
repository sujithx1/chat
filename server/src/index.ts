import { InferInsertModel } from 'drizzle-orm';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { UserSchema } from './db/schema';
import { errorHandler } from './middleware/error-middleware';
import { api } from './router';
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
export default app
