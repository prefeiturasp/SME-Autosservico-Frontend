"use client";
import {
    ONBOARDING_STORAGE_KEY,
    TOUR_STEPS,
    useOnboardingStore,
} from "@/states/onboarding";
import { useEffect } from "react";

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
