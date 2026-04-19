import { eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { Context } from "hono";
import z from "zod";
import { Pretty_Error } from "../../config/error";
import { db } from "../../db";
import { ChatMembersSchema, ChatSchema } from "../../db/schema";
import { getAuthContext } from "../../middleware/auth-middleware";

  const createChatSchema=z.object({
    userId:z.string(),
  })

export const createChatController =async (c: Context) => {

    const authuser=getAuthContext(c)

      const body =await createChatSchema.safeParseAsync(await c.req.json());
      if(!body.success) return c.json({message:Pretty_Error(body.error)}, 400);
    const { userId: targetUserId } = body.data;

    const currentUserId = authuser.id!;

    if (!targetUserId) {
      return c.json({ message: "target userId required" }, 400);
    }

    if (targetUserId === currentUserId) {
      return c.json({ message: "Cannot chat with yourself" }, 400);
    }

    // 🔍 Check if chat already exists (1–1)
    const existingChat = await db
  .select({
    chatId: ChatMembersSchema.chatId,
  })
  .from(ChatMembersSchema)
  .innerJoin(ChatSchema, eq(ChatMembersSchema.chatId, ChatSchema.id))
  .where(
    inArray(ChatMembersSchema.userId, [currentUserId, targetUserId])
  )
  .groupBy(ChatMembersSchema.chatId)
  .having(sql`
    COUNT(DISTINCT ${ChatMembersSchema.userId}) = 2
    AND BOOL_AND(${ChatSchema.isGroup} = false)
  `);

if (existingChat.length) {
  return c.json({ chatId: existingChat[0].chatId });
}

    //FIXME:  this code i need to change
    // for (const chat of existing) {
    //   const members = await db
    //     .select(getTableColumns(ChatMembersSchema))
    //     .from(ChatMembersSchema)
    //     .where(eq(ChatMembersSchema.chatId, chat.chatId));

    //   const userIds = members.map((m) => m.userId);

    //   if (
    //     userIds.length === 2 &&
    //     userIds.includes(currentUserId) &&
    //     userIds.includes(targetUserId)
    //   ) {
    //     existingChatId = chat.chatId;
    //     break;
    //   }
    // }

  

    // 🆕 Create new chat
    const [chat] = await db
      .insert(ChatSchema)
      .values({
        isGroup: false,
      })
      .returning();

    // 👥 Add members
    await db.insert(ChatMembersSchema).values([
      {
        chatId: chat.id,
        userId: currentUserId,
      },
      {
        chatId: chat.id,
        userId: targetUserId,
      },
    ]);

    return c.json({ chatId: chat.id });




};