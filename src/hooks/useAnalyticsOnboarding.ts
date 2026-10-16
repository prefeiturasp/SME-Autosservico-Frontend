"use client";
import {
    ANALYTICS_ONBOARDING_STORAGE_KEY,
    ANALYTICS_TOUR_STEPS,
    useOnboardingStore,
} from "@/states/onboarding";

export function useAnalyticsOnboarding() {
    const {
        isAnalyticsTourActive,
        analyticsTourStepIndex,
        startAnalyticsTour,
        nextAnalyticsStep,
        closeAnalyticsTour,
    } = useOnboardingStore();

    const triggerAnalyticsTour = () => {
        if (globalThis.window === undefined) return;
        const hasCompleted = localStorage.getItem(
            ANALYTICS_ONBOARDING_STORAGE_KEY,
        );
        if (!hasCompleted) {
            startAnalyticsTour();
        }
    };

    const currentStep = ANALYTICS_TOUR_STEPS[analyticsTourStepIndex];
    const totalSteps = ANALYTICS_TOUR_STEPS.length;

    return {
        isAnalyticsTourActive,
        analyticsTourStepIndex,
        currentStep,
        totalSteps,
        triggerAnalyticsTour,
        nextAnalyticsStep,
        closeAnalyticsTour,
    };
}
