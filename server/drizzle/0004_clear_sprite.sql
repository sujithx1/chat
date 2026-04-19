CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'video', 'audio', 'file');--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "type" SET DEFAULT 'text'::"public"."message_type";--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "type" SET DATA TYPE "public"."message_type" USING "type"::"public"."message_type";