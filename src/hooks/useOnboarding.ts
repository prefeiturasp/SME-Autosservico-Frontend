"use client";
import { useEffect } from "react";
import {
    useOnboardingStore,
    ONBOARDING_STORAGE_KEY,
    TOUR_STEPS,
} from "@/states/onboarding";

export function useOnboarding() {
    const {
        isWelcomeModalOpen,
        hasCompletedOnboarding,
        isTourActive,
        currentStepIndex,
        openWelcomeModal,
        closeWelcomeModal,
        startTour,
        nextStep,
        prevStep,
        closeTour,
        completeOnboarding,
    } = useOnboardingStore();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);

        if (!hasCompleted) {
            openWelcomeModal();
        }
    }, [openWelcomeModal]);

    const currentStep = TOUR_STEPS[currentStepIndex];
    const totalSteps = TOUR_STEPS.length;

    return {
        isWelcomeModalOpen,
        hasCompletedOnboarding,
        isTourActive,
        currentStepIndex,
        currentStep,
        totalSteps,
        openWelcomeModal,
        closeWelcomeModal,
        startTour,
        nextStep,
        prevStep,
        closeTour,
        completeOnboarding,
    };
}
