import { and, eq } from "drizzle-orm";
import { Context } from "hono";
import z from "zod";
import { db } from "../../db";
import { ChatMembersSchema, MessagesSchema } from "../../db/schema";
import { getAuthContext } from "../../middleware/auth-middleware";

export const sendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1),
});



export const SendMessageController = async (c: Context) => {

  const authUser = getAuthContext(c);
    const body = await sendMessageSchema.parseAsync(await c.req.json());

    const { chatId, content } = body;
    const userId = authUser.id!;

    // ✅ check user is member of chat
    const [member] = await db
      .select()
      .from(ChatMembersSchema)
      .where(
        and(
          eq(ChatMembersSchema.chatId, chatId),
          eq(ChatMembersSchema.userId, userId)
        )
      );

    if (!member) {
      return c.json({ message: "Not part of this chat" }, 403);
    }

    // 💾 insert message
    // we can change type to enum 
    const [message] = await db
      .insert(MessagesSchema)
      .values({
        chatId,
        senderId: userId,
        content,
        type: "text",
      })
      .returning();

    return c.json({
      message,
    });
};