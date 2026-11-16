"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "@/lib/action";
import { requireUserId } from "@/lib/auth-session";
import {
  onboardingInputSchema,
  preferencesInputSchema,
  type OnboardingInput,
  type PreferencesInput,
} from "./schemas";
import * as service from "./service";

export async function saveOnboarding(input: OnboardingInput) {
  return runAction(async () => {
    const userId = await requireUserId();
    const profile = await service.saveOnboardingProfile(
      userId,
      onboardingInputSchema.parse(input),
    );
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/nutrition");
    return profile;
  }, "We could not save your nutrition plan.");
}

export async function updatePreferences(input: PreferencesInput) {
  return runAction(async () => {
    const userId = await requireUserId();
    const preferences = await service.savePreferences(
      userId,
      preferencesInputSchema.parse(input),
    );
    revalidatePath("/settings");
    return preferences;
  }, "We could not save your settings.");
}

export async function deleteAccount() {
  return runAction(async () => {
    const userId = await requireUserId();
    await service.softDeleteAccount(userId);
    return { scheduled: true };
  }, "We could not schedule account deletion.");
}
