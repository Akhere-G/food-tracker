export default function OnboardingProgress({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: number;
}) {
  return (
    <div
      className="mb-8 flex gap-2"
      aria-label={`Step ${currentStep + 1} of ${steps}`}
    >
      {Array.from({ length: steps }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-full ${
            index <= currentStep ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}
