import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import LoginLoading from "@/app/(auth)/login/loading";
import RegisterLoading from "@/app/(auth)/register/loading";
import DashboardLoading from "@/app/(dashboard)/dashboard/loading";
import NutritionLoading from "@/app/(dashboard)/nutrition/loading";
import MealsLoading from "@/app/(dashboard)/meals/loading";
import AddMealLoading from "@/app/(dashboard)/addmeal/loading";
import EditMealLoading from "@/app/(dashboard)/meals/[mealId]/edit/loading";
import SettingsLoading from "@/app/(dashboard)/settings/loading";
import OnboardingSkeleton from "@/app/features/onboarding/components/OnboardingSkeleton";
import DashboardShellSkeleton from "./DashboardShellSkeleton";

const loadingStates: [string, ComponentType][] = [
  ["login", LoginLoading],
  ["register", RegisterLoading],
  ["dashboard", DashboardLoading],
  ["nutrition", NutritionLoading],
  ["meals", MealsLoading],
  ["add meal", AddMealLoading],
  ["edit meal", EditMealLoading],
  ["settings", SettingsLoading],
  ["onboarding", OnboardingSkeleton],
  ["session shell", DashboardShellSkeleton],
];

describe("loading accessibility", () => {
  it.each(loadingStates)("%s announces one status without exposing fake controls", (_, Component) => {
    const html = renderToStaticMarkup(createElement(Component));

    expect(html.match(/role="status"/g)).toHaveLength(1);
    expect(html).toContain('aria-hidden="true" aria-busy="true"');
    expect(html).toContain('data-slot="skeleton"');
    expect(html).not.toMatch(/<(button|input|select|textarea|a|form)\b/);
  });
});
