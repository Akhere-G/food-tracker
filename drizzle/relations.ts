import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id
		}),
	},
	user: {
		accounts: r.many.account(),
		meals: r.many.meal(),
		nutritionProfiles: r.many.nutritionProfile(),
		sessions: r.many.session(),
		userPreferences: r.many.userPreferences(),
	},
	food: {
		nutrients: r.many.nutrient({
			from: r.food.id.through(r.foodNutrient.foodId),
			to: r.nutrient.id.through(r.foodNutrient.nutrientId)
		}),
		mealEntries: r.many.mealEntry(),
		servings: r.many.serving(),
	},
	nutrient: {
		foods: r.many.food(),
	},
	meal: {
		user: r.one.user({
			from: r.meal.userId,
			to: r.user.id
		}),
		mealEntries: r.many.mealEntry(),
	},
	mealEntry: {
		food: r.one.food({
			from: r.mealEntry.foodId,
			to: r.food.id
		}),
		meal: r.one.meal({
			from: r.mealEntry.mealId,
			to: r.meal.id
		}),
		serving: r.one.serving({
			from: r.mealEntry.servingId,
			to: r.serving.id
		}),
	},
	serving: {
		mealEntries: r.many.mealEntry(),
		food: r.one.food({
			from: r.serving.foodId,
			to: r.food.id
		}),
	},
	nutritionProfile: {
		user: r.one.user({
			from: r.nutritionProfile.userId,
			to: r.user.id
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id
		}),
	},
	userPreferences: {
		user: r.one.user({
			from: r.userPreferences.userId,
			to: r.user.id
		}),
	},
}))