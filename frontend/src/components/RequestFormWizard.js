import React from 'react';

function RequestFormWizard({ steps, activeStep, onStepChange, children }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/45 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const isClickable = index <= activeStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isClickable) {
                      onStepChange(index);
                    }
                  }}
                  disabled={!isClickable}
                  className={`group flex min-w-0 flex-1 basis-0 items-stretch rounded-xl px-2 py-2 text-center transition-colors sm:px-3 ${
                    isClickable ? 'hover:bg-white/70' : 'cursor-not-allowed opacity-60'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center sm:min-h-[56px]">
                    <div className="flex w-full items-center justify-center gap-2">
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isActive
                            ? 'border-[#002DB5] bg-[#002DB5] text-white'
                            : isCompleted
                              ? 'border-[#012E72] bg-[#012E72] text-white'
                              : 'border-[#d8cbb8] bg-white text-[#012E72]'
                        }`}
                      >
                        {Icon ? <Icon className="h-5 w-5" /> : <span className="text-sm font-semibold">{index + 1}</span>}
                      </span>

                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#010407]/45">Step {index + 1}</span>
                    </div>
                  </div>
                </button>

              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}

export default RequestFormWizard;