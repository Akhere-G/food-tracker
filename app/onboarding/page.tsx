import { Suspense } from "react";
import Logo from "@/components/layout/Logo";
import OnboardingSkeleton from "@/app/features/onboarding/components/OnboardingSkeleton";
import OnboardingWizard from "@/app/features/onboarding/components/OnboardingWizard";
import { getSession } from "@/lib/auth-session";
import { getOnboardingProfile } from "@/app/features/onboarding/service";
import { profileToOnboardingInput } from "@/app/features/onboarding/mappers";

async function OnboardingContent() {
  const session = await getSession();
  const profile = session ? await getOnboardingProfile(session.user.id) : null;

  return (
    <OnboardingWizard
      authenticated={Boolean(session)}
      initialValue={profile ? profileToOnboardingInput(profile) : undefined}
    />
  );
}

export default function OnboardingPage() {
  return (
    <main className="min-h-dvh px-4 py-6 md:px-8">
      <header className="mx-auto mb-10 flex max-w-7xl items-center justify-between border-b pb-5">
        <Logo />
        <p className="hidden text-sm text-muted-foreground sm:block">
          Your answers stay on this device until you create an account.
        </p>
      </header>
      <Suspense fallback={<OnboardingSkeleton />}>
        <OnboardingContent />
      </Suspense>
    </main>
  );
}
