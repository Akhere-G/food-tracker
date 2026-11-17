import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardShellSkeleton from "@/components/layout/loading/DashboardShellSkeleton";
import { getOnboardingProfile, getPreferences } from "@/app/features/onboarding/service";

async function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [profile, preferences] = await Promise.all([
    getOnboardingProfile(session.user.id),
    getPreferences(session.user.id),
  ]);
  if (!profile) redirect("/onboarding");

  return (
    <DashboardShell
      appearance={{
        themeMode: preferences?.themeMode ?? "system",
        colorTheme: preferences?.colorTheme ?? "cranberry",
      }}
    >
      {children}
    </DashboardShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <ProtectedDashboard>{children}</ProtectedDashboard>
    </Suspense>
  );
}
