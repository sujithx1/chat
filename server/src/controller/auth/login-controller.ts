import { eq } from "drizzle-orm";
import { Context } from "hono";
import { Pretty_Error } from "../../config/error";
import { db } from "../../db";
import { UserSchema } from "../../db/schema";
import { comparePassword } from "../../hash";
import { signToken } from "../../jwt";
import { loginSchema } from "../../modules/auth-schema";



export const LoginUserController = async (c: Context) => {

  const body = await c.req.json();
    const parsed = await loginSchema.safeParseAsync(body);

    if(!parsed.success) return c.json({message:Pretty_Error(parsed.error)}, 400);

    const  { email, password } = parsed.data
    const [user] = await db
      .select({id:UserSchema.id,name:UserSchema.name,email:UserSchema.email,password:UserSchema.password})
      .from(UserSchema)
      .where(eq(UserSchema.email, email));

    if (!user) {
      return c.json({ message: "Invalid credentials" }, 400);
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return c.json({ message: "Invalid credentials" }, 400);
    }

    const token = signToken({ userId: user.id });

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    }, 200);
};