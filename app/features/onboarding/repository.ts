import { db } from "@/db";
import { user } from "@/db/auth-schema";
import {
  nutritionProfile,
  userPreferences,
  type NewNutritionProfile,
} from "@/db/profile-schema";
import { eq } from "drizzle-orm";
import type { PreferencesInput } from "./schemas";

export async function findNutritionProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(nutritionProfile)
    .where(eq(nutritionProfile.userId, userId))
    .limit(1);
  return profile;
}

export async function upsertNutritionProfile(values: NewNutritionProfile) {
  const [profile] = await db
    .insert(nutritionProfile)
    .values(values)
    .onConflictDoUpdate({
      target: nutritionProfile.userId,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();
  return profile;
}

export async function findPreferences(userId: string) {
  const [preferences] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return preferences;
}

export async function upsertPreferences(
  userId: string,
  values: PreferencesInput,
) {
  const [preferences] = await db
    .insert(userPreferences)
    .values({ userId, ...values })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: { ...values, updatedAt: new Date() },
    })
    .returning();
  return preferences;
}

export async function scheduleAccountDeletion(
  userId: string,
  deletedAt: Date,
  scheduledDeletionAt: Date,
) {
  await db
    .update(user)
    .set({ deletedAt, scheduledDeletionAt })
    .where(eq(user.id, userId));
}
