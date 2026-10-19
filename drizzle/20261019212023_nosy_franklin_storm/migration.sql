CREATE TABLE "food" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"external_id" text NOT NULL,
	"external_source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "external_id_external_source_unique" UNIQUE("external_id","external_source")
);
--> statement-breakpoint
CREATE TABLE "food_nutrient" (
	"food_id" text,
	"nutrient_id" text,
	"amount_per_100g" numeric(12,5) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "food_nutrient_pkey" PRIMARY KEY("food_id","nutrient_id"),
	CONSTRAINT "food_nutrient_amount_nonnegative" CHECK ("amount_per_100g" >= 0)
);
--> statement-breakpoint
CREATE TABLE "meal" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"eaten_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_entry" (
	"id" text PRIMARY KEY,
	"meal_id" text NOT NULL,
	"food_id" text NOT NULL,
	"amount_in_grams" numeric(12,5) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meal_entry_amount_positive" CHECK ("amount_in_grams" > 0)
);
--> statement-breakpoint
CREATE TABLE "nutrient" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL UNIQUE,
	"unit" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "food_nutrient_food_id_idx" ON "food_nutrient" ("food_id");--> statement-breakpoint
CREATE INDEX "food_nutrient_nutrient_id_idx" ON "food_nutrient" ("nutrient_id");--> statement-breakpoint
CREATE INDEX "meal_user_eaten_at_idx" ON "meal" ("user_id","eaten_at");--> statement-breakpoint
ALTER TABLE "food_nutrient" ADD CONSTRAINT "food_nutrient_food_id_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "food_nutrient" ADD CONSTRAINT "food_nutrient_nutrient_id_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "nutrient"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal" ADD CONSTRAINT "meal_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_meal_id_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meal"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_food_id_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE CASCADE;