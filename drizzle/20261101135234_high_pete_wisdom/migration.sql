CREATE TABLE "serving" (
	"id" text PRIMARY KEY,
	"external_id" text NOT NULL,
	"food_id" text NOT NULL,
	"label" text NOT NULL,
	"amount_in_grams" numeric(12,5) NOT NULL,
	CONSTRAINT "serving_external_id_food_id_unique" UNIQUE("external_id","food_id"),
	CONSTRAINT "serving_amount_positive" CHECK ("amount_in_grams" > 0)
);
--> statement-breakpoint
ALTER TABLE "meal_entry" ADD COLUMN "serving_id" text;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD COLUMN "serving_quantity" numeric(12,5);--> statement-breakpoint
CREATE INDEX "meal_entry_meal_id" ON "meal_entry" ("meal_id");--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_serving_id_serving_id_fkey" FOREIGN KEY ("serving_id") REFERENCES "serving"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "serving" ADD CONSTRAINT "serving_food_id_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal_entry" DROP CONSTRAINT "meal_entry_food_id_food_id_fkey", ADD CONSTRAINT "meal_entry_food_id_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "meal_entry" ADD CONSTRAINT "meal_entry_serving_quantity_positive" CHECK ("serving_quantity" IS NULL OR "serving_quantity" > 0);