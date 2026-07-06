"use client";

import { SpotlightTourOverlay } from "@/components/dashboard/Onboarding/SpotlightTourOverlay";
import { useDeployHealthOnboarding } from "@/hooks/useDeployHealthOnboarding";

export function DeployHealthTourOverlay() {
    const {
        isDeployTourActive,
        currentStep,
        deployTourStepIndex,
        totalSteps,
        nextDeployStep,
        closeDeployTour,
    } = useDeployHealthOnboarding();

    return (
        <SpotlightTourOverlay
            isActive={isDeployTourActive}
            currentStep={currentStep}
            currentStepIndex={deployTourStepIndex}
            totalSteps={totalSteps}
            onNext={nextDeployStep}
            onClose={closeDeployTour}
        />
    );
}
