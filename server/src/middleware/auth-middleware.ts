import { eq, getTableColumns } from "drizzle-orm";
import { Context, Next } from "hono";
import { HonoCtxKey, userTypes } from "..";
import { db } from "../db";
import { UserSchema } from "../db/schema";
import { verifyToken } from "../jwt";



export const authMiddleware=async (c: Context, next: Next) => {
  const authorization = c.req.header("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authorization.split(" ")[1];

    const payload = verifyToken(token);

    const userId = payload.userId;

    const [user] = await db
      .select(getTableColumns(UserSchema))
      .from(UserSchema)
      .where(eq(UserSchema.id, userId));

    if (!user) {
      return c.json({ message: "User not found" }, 401);
    }

    c.set(HonoCtxKey.AuthUser, user);

    await next();
};


export const getAuthContext = (c: Context) => {
 
  const val=c.get(HonoCtxKey.AuthUser)
  if (!val||!val.id) {
    throw new Error('Auth user not found in context');
  } 
   return val as userTypes

};