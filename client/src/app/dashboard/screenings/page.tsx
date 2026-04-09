"use client";

import ScreeningFlow from "@/components/screening/ScreeningFlow";

export default function ScreeningsPage() {
  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-brand-dark">
          Screening Logic
        </h1>
        <p className="text-brand-muted text-sm max-w-2xl">
          Execute automated alignment analysis between technical job
          requirements and candidate profiles. The system uses semantic matching
          algorithms to verify technical competency and experience seniority.
        </p>
      </header>

      <ScreeningFlow />
    </div>
  );
}
