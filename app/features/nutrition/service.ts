import { requireUserId } from "@/lib/auth-session";
import { AppError } from "@/lib/errors";
import { getOnboardingProfile } from "@/app/features/onboarding/service";
import {
  DEFAULT_NUTRIENT,
  parseSelectedNutrient,
  QUERY_NUTRIENTS,
} from "./definitions";
import { nutritionPeriodRange, type NutritionPeriod } from "./period";
import { buildNutritionReport } from "./report";
import * as repository from "./repository";

type NutritionReportRequest = {
  period: NutritionPeriod;
  anchor?: string;
  nutrient?: string;
};

export async function getNutritionReport(request: NutritionReportRequest) {
  const userId = await requireUserId();
  const profile = await getOnboardingProfile(userId);
  if (!profile) throw new AppError("Nutrition profile not found.", "not_found");

  const range = nutritionPeriodRange(
    request.period,
    profile.timezone,
    request.anchor,
  );
  const selectedNutrient =
    parseSelectedNutrient(request.nutrient) ?? defaultNutrient(profile.nutritionPriorities);
  const query = { userId, start: range.start, end: range.end };
  const [events, rows] = await Promise.all([
    repository.findMealEvents(query),
    repository.findNutrientIntakeRows(query, QUERY_NUTRIENTS),
  ]);

  return {
    range,
    profile,
    report: buildNutritionReport({
      events,
      rows,
      profile,
      period: request.period,
      start: range.start,
      end: range.end,
      selectedNutrient,
    }),
  };
}

function defaultNutrient(priorities: string[]) {
  if (priorities.includes("reduce_sodium")) return "Sodium";
  if (priorities.includes("more_fibre")) return "Fibre";
  if (priorities.includes("support_bones")) return "Vitamin D";
  if (priorities.includes("support_energy")) return "Iron";
  return DEFAULT_NUTRIENT;
}
