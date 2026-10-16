"use client";
import {
    DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY,
    DEPLOY_HEALTH_TOUR_STEPS,
    useOnboardingStore,
} from "@/states/onboarding";

export function useDeployHealthOnboarding() {
    const {
        isDeployTourActive,
        deployTourStepIndex,
        startDeployTour,
        nextDeployStep,
        closeDeployTour,
    } = useOnboardingStore();

    const triggerDeployTour = () => {
        if (globalThis.window === undefined) return;
        const hasCompleted = localStorage.getItem(
            DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY,
        );
        if (!hasCompleted) {
            startDeployTour();
        }
    };

    const currentStep = DEPLOY_HEALTH_TOUR_STEPS[deployTourStepIndex];
    const totalSteps = DEPLOY_HEALTH_TOUR_STEPS.length;

    return {
        isDeployTourActive,
        deployTourStepIndex,
        currentStep,
        totalSteps,
        triggerDeployTour,
        nextDeployStep,
        closeDeployTour,
    };
}
