CREATE TABLE "nutrition_profile" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL CONSTRAINT "nutrition_profile_user_unique" UNIQUE,
	"date_of_birth" date NOT NULL,
	"sex" text NOT NULL,
	"gender_identity" text,
	"height_cm" numeric(6,2) NOT NULL,
	"current_weight_kg" numeric(6,2) NOT NULL,
	"target_weight_kg" numeric(6,2) NOT NULL,
	"goal" text NOT NULL,
	"activity_level" text NOT NULL,
	"journey_feeling" text NOT NULL,
	"biggest_challenge" text NOT NULL,
	"previous_attempts" jsonb DEFAULT '[]' NOT NULL,
	"requested_weekly_change_kg" numeric(4,2) NOT NULL,
	"planned_weekly_change_kg" numeric(4,2) NOT NULL,
	"daily_calories" integer NOT NULL,
	"daily_protein_grams" integer NOT NULL,
	"daily_carbohydrate_grams" integer NOT NULL,
	"daily_fat_grams" integer NOT NULL,
	"target_date" date,
	"timezone" text NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "nutrition_profile_weekly_change_range" CHECK ("requested_weekly_change_kg" >= 0 AND "requested_weekly_change_kg" <= 2)
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL CONSTRAINT "user_preferences_user_unique" UNIQUE,
	"theme_mode" text DEFAULT 'system' NOT NULL,
	"color_theme" text DEFAULT 'cranberry' NOT NULL,
	"weight_unit" text DEFAULT 'kg' NOT NULL,
	"height_unit" text DEFAULT 'cm' NOT NULL,
	"energy_unit" text DEFAULT 'kcal' NOT NULL,
	"meal_reminders" boolean DEFAULT false NOT NULL,
	"daily_reminder" boolean DEFAULT false NOT NULL,
	"weekly_summary" boolean DEFAULT true NOT NULL,
	"goal_milestones" boolean DEFAULT true NOT NULL,
	"product_updates" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "scheduled_deletion_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "nutrition_profile_user_idx" ON "nutrition_profile" ("user_id");--> statement-breakpoint
ALTER TABLE "nutrition_profile" ADD CONSTRAINT "nutrition_profile_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;