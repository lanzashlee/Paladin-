import React from 'react';

export function SkeletonLine({ className = '' }) {
  return <div className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse ${className}`} />;
}

export function SkeletonInput({ className = 'h-10' }) {
  return <SkeletonLine className={`w-full ${className}`} />;
}

export function SkeletonButton({ className = 'h-10 w-24' }) {
  return <SkeletonLine className={`rounded-lg ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine key={index} className={index === lines - 1 ? 'w-3/4 h-4' : 'w-full h-4'} />
      ))}
    </div>
  );
}

export function SkeletonField({ label = true }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <SkeletonLine className="w-24 h-4" />}
      <SkeletonInput className="h-10" />
    </div>
  );
}

export function SkeletonFormSection({ fieldCount = 2 }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <SkeletonField key={index} label={true} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonModalHeader() {
  return (
    <div className="space-y-3">
      <SkeletonLine className="w-20 h-6 rounded-full" />
      <SkeletonLine className="w-2/3 h-8" />
      <SkeletonText lines={2} className="pt-2" />
    </div>
  );
}

export function SkeletonWizardSteps({ steps = 3 }) {
  return (
    <div className="rounded-2xl border border-[#e7dccb] bg-[#F7F4EF]/45 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {Array.from({ length: steps }).map((_, index) => (
          <div key={index} className="flex min-w-0 flex-1 basis-0 items-center justify-center gap-2">
            <SkeletonLine className="h-10 w-10 rounded-full" />
            <SkeletonLine className="hidden sm:block h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return null;
}

Skeleton.Line = SkeletonLine;
Skeleton.Input = SkeletonInput;
Skeleton.Button = SkeletonButton;
Skeleton.Text = SkeletonText;
Skeleton.Field = SkeletonField;
Skeleton.FormSection = SkeletonFormSection;
Skeleton.ModalHeader = SkeletonModalHeader;
Skeleton.WizardSteps = SkeletonWizardSteps;

export default Skeleton;
