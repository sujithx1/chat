import { Hono } from 'hono';
import { errorHandler } from './middleware/error-middleware';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { api } from './router';


const app = new Hono()

app.use(logger())
app.use("*",cors())

app.route('/api/v1', api);



app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.onError((err, c) => errorHandler(err, c));
export default app
