import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type OnboardingNavigationProps = {
  step: number;
  stepCount: number;
  authenticated: boolean;
  ready: boolean;
  pending: boolean;
  backAction: () => void;
  continueAction: () => void;
  finishAction: () => void;
};

export default function OnboardingNavigation({
  step,
  stepCount,
  authenticated,
  ready,
  pending,
  backAction,
  continueAction,
  finishAction,
}: OnboardingNavigationProps) {
  const finalStep = step === stepCount - 1;
  const finishLabel = pending
    ? "Saving…"
    : authenticated
      ? "Save my plan"
      : "Create my account";

  return (
    <div className="mt-10 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
      <Button
        variant="outline"
        size="lg"
        disabled={!ready || step === 0 || pending}
        onClick={backAction}
      >
        <ArrowLeft /> Back
      </Button>
      {finalStep ? (
        <Button size="lg" disabled={!ready || pending} onClick={finishAction}>
          {finishLabel}
        </Button>
      ) : (
        <Button size="lg" disabled={!ready} onClick={continueAction}>
          Continue <ArrowRight />
        </Button>
      )}
    </div>
  );
}
