// src/db/schema.ts
import { boolean, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: text("name"),
//   email: text("email").unique(),
//   phone: text("phone").unique().notNull(),
//     password: text("password").notNull(),

//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const chats = pgTable("chats", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   isGroup: boolean("is_group").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const messages = pgTable("messages", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   chatId: uuid("chat_id").references(() => chats.id),
//   senderId: uuid("sender_id").references(() => users.id),
//   content: text("content"),
//   createdAt: timestamp("created_at").defaultNow(),
// });


// 👤 USERS
//
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
   phone: text("phone").unique().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//
// 💬 CHATS
//
export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  isGroup: boolean("is_group").default(false).notNull(),
  name: text("name"), // group name (nullable for 1-1)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//
// 👥 CHAT MEMBERS (many-to-many)
//
export const chatMembers = pgTable(
  "chat_members",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: text("role").default("member").notNull(), // admin | member
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => 
    [primaryKey({ columns: [t.chatId, t.userId] })],

);

//
// 📩 MESSAGES
//
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),

  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  content: text("content"), // nullable for media
  type: text("type").default("text").notNull(), // text | image | file

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

//
// 👁️ MESSAGE READS (read receipts)
//
export const messageReads = pgTable(
  "message_reads",
  {
    messageId: uuid("message_id")
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    readAt: timestamp("read_at").defaultNow().notNull(),
  },
  (t) => 
    [ primaryKey({ columns: [t.messageId, t.userId] })],

);