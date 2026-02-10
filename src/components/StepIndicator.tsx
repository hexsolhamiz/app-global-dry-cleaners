import { Check } from 'lucide-react';
import { useFormContext } from '@/context/FormContext';

const STEPS = [
  { label: 'Address', stepIndex: 0 },
  { label: 'Collection Time', stepIndex: 1 },
  { label: 'Delivery Time', stepIndex: 2 },
  { label: 'Selected Services', stepIndex: 3 },
  { label: 'Contact', stepIndex: 4 },
  { label: 'Payment', stepIndex: 5 },
];

// Map step index to form page
const STEP_TO_PAGE: Record<number, number> = {
  0: 0, 1: 1, 2: 1, 3: 2, 4: 3, 5: 4,
};

export function StepIndicator() {
  const { completedSteps, currentPage } = useFormContext();

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Your Progress
      </h3>
      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const isCompleted = completedSteps.has(step.stepIndex);
          const isActive = STEP_TO_PAGE[step.stepIndex] === currentPage;

          return (
            <div key={step.stepIndex} className="flex items-center gap-3 py-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'border-white bg-green-500'
                    : isActive
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/30 bg-transparent'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-success-foreground" />
                ) : (
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? 'text-primary' : 'text-muted-foreground/50'
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isCompleted
                    ? 'text-success'
                    : isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
