CREATE TABLE "threads" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");