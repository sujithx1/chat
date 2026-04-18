import { Hono } from 'hono';
import { errorHandler } from './middleware/error-middleware';


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.onError((err, c) => errorHandler(err, c));
export default app
