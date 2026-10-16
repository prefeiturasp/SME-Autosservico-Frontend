"use client";

import { SpotlightTourOverlay } from "@/components/dashboard/Onboarding/SpotlightTourOverlay";
import { useAnalyticsOnboarding } from "@/hooks/useAnalyticsOnboarding";

export function AnalyticsTourOverlay() {
    const {
        isAnalyticsTourActive,
        currentStep,
        analyticsTourStepIndex,
        totalSteps,
        nextAnalyticsStep,
        closeAnalyticsTour,
    } = useAnalyticsOnboarding();

    return (
        <SpotlightTourOverlay
            isActive={isAnalyticsTourActive}
            currentStep={currentStep}
            currentStepIndex={analyticsTourStepIndex}
            totalSteps={totalSteps}
            onNext={nextAnalyticsStep}
            onClose={closeAnalyticsTour}
        />
    );
}
