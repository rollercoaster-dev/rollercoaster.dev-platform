CREATE TABLE "badge_requirements" (
	"id" text PRIMARY KEY NOT NULL,
	"badge_id" text NOT NULL,
	"description" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"content" text,
	"progress" integer DEFAULT 0 NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"start_date" text,
	"target_date" text,
	"external_id" text,
	"external_source" text
);
--> statement-breakpoint
ALTER TABLE "badge_requirements" ADD CONSTRAINT "badge_requirements_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE cascade ON UPDATE no action;