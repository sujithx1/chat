import { eq } from "drizzle-orm";
import { Context } from "hono";
import { Pretty_Error } from "../../config/error";
import { db } from "../../db";
import { users } from "../../db/schema";
import { hashPassword } from "../../hash";
import { signToken } from "../../jwt";
import { registerSchema } from "../../modules/auth-schema";




export const register = async (c: Context) => {
    const body = await c.req.json();
    const parsed = await registerSchema.safeParseAsync(body);
    if(!parsed.success) return c.json({message:Pretty_Error(parsed.error)}, 400);

     const  { email, password ,name,phone} = parsed.data

    // check existing user
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length) {
      return c.json({ message: "User already exists" }, 400);
    }

    const hashed = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        ...parsed.data,
        password: hashed,
      })
      .returning();

    const token = signToken({ userId: user.id });

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,  
      message: "User registered successfully"
    }, 201);
};