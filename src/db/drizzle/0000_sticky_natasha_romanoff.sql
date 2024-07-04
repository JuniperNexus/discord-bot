CREATE TABLE IF NOT EXISTS "Coin" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer,
	"timestamp" timestamp NOT NULL,
	"reason" text,
	"event_name" text,
	"operator" text,
	"user_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp NOT NULL,
	"event_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VoiceLevel" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"guild_id" text NOT NULL,
	"xp" text NOT NULL,
	"level" text,
	"time_spent" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Coin" ADD CONSTRAINT "Coin_event_name_Event_event_name_fk" FOREIGN KEY ("event_name") REFERENCES "public"."Event"("event_name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Coin" ADD CONSTRAINT "Coin_user_id_User_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
