import { create } from "zustand";
import {
    ANALYTICS_TOUR_STEPS,
    DEPLOY_HEALTH_TOUR_STEPS,
    TOUR_STEPS,
    type TourStep,
} from "./tour-steps";
export {
    ANALYTICS_TOUR_STEPS,
    DEPLOY_HEALTH_TOUR_STEPS,
    TOUR_STEPS,
} from "./tour-steps";
export type { TourStep } from "./tour-steps";

type OnboardingState = {
    isWelcomeModalOpen: boolean;
    hasCompletedOnboarding: boolean;
    isTourActive: boolean;
    currentStepIndex: number;
    isDeployTourActive: boolean;
    deployTourStepIndex: number;
    isAnalyticsTourActive: boolean;
    analyticsTourStepIndex: number;
};

type OnboardingActions = {
    openWelcomeModal: () => void;
    closeWelcomeModal: () => void;
    startTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    closeTour: () => void;
    completeOnboarding: () => void;
    startDeployTour: () => void;
    nextDeployStep: () => void;
    closeDeployTour: () => void;
    startAnalyticsTour: () => void;
    nextAnalyticsStep: () => void;
    closeAnalyticsTour: () => void;
};

export const ONBOARDING_STORAGE_KEY = "autosservico-onboarding-completed";
export const DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY =
    "autosservico-deploy-onboarding-completed";
export const ANALYTICS_ONBOARDING_STORAGE_KEY =
    "autosservico-analytics-onboarding-completed";

function saveTourCompletion(storageKey: string) {
    if (globalThis.window !== undefined) {
        localStorage.setItem(storageKey, "true");
    }
}

function makeNextTourStep(
    tourSteps: TourStep[],
    storageKey: string,
    getIndex: () => number,
    advance: (next: number) => void,
    complete: () => void,
): () => void {
    return () => {
        const idx = getIndex();
        if (idx < tourSteps.length - 1) {
            advance(idx + 1);
        } else {
            saveTourCompletion(storageKey);
            complete();
        }
    };
}

function makeCloseTour(storageKey: string, close: () => void): () => void {
    return () => {
        saveTourCompletion(storageKey);
        close();
    };
}

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
    (set, get) => ({
        isWelcomeModalOpen: false,
        hasCompletedOnboarding: false,
        isTourActive: false,
        currentStepIndex: 0,
        isDeployTourActive: false,
        deployTourStepIndex: 0,
        isAnalyticsTourActive: false,
        analyticsTourStepIndex: 0,

        openWelcomeModal: () => set({ isWelcomeModalOpen: true }),
        closeWelcomeModal: () => set({ isWelcomeModalOpen: false }),

        startTour: () => {
            set({
                isWelcomeModalOpen: false,
                isTourActive: true,
                currentStepIndex: 0,
            });
        },

        nextStep: () => {
            const { currentStepIndex } = get();
            if (currentStepIndex < TOUR_STEPS.length - 1) {
                set({ currentStepIndex: currentStepIndex + 1 });
            } else {
                get().completeOnboarding();
            }
        },

        prevStep: () => {
            const { currentStepIndex } = get();
            if (currentStepIndex > 0) {
                set({ currentStepIndex: currentStepIndex - 1 });
            }
        },

        closeTour: () => {
            set({ isTourActive: false, currentStepIndex: 0 });
            get().completeOnboarding();
        },

        completeOnboarding: () => {
            saveTourCompletion(ONBOARDING_STORAGE_KEY);
            set({
                hasCompletedOnboarding: true,
                isWelcomeModalOpen: false,
                isTourActive: false,
            });
        },

        startDeployTour: () => {
            set({ isDeployTourActive: true, deployTourStepIndex: 0 });
        },

        nextDeployStep: makeNextTourStep(
            DEPLOY_HEALTH_TOUR_STEPS,
            DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY,
            () => get().deployTourStepIndex,
            (i) => set({ deployTourStepIndex: i }),
            () => set({ isDeployTourActive: false, deployTourStepIndex: 0 }),
        ),

        closeDeployTour: makeCloseTour(
            DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY,
            () => set({ isDeployTourActive: false, deployTourStepIndex: 0 }),
        ),

        startAnalyticsTour: () => {
            set({ isAnalyticsTourActive: true, analyticsTourStepIndex: 0 });
        },

        nextAnalyticsStep: makeNextTourStep(
            ANALYTICS_TOUR_STEPS,
            ANALYTICS_ONBOARDING_STORAGE_KEY,
            () => get().analyticsTourStepIndex,
            (i) => set({ analyticsTourStepIndex: i }),
            () =>
                set({
                    isAnalyticsTourActive: false,
                    analyticsTourStepIndex: 0,
                }),
        ),

        closeAnalyticsTour: makeCloseTour(
            ANALYTICS_ONBOARDING_STORAGE_KEY,
            () =>
                set({
                    isAnalyticsTourActive: false,
                    analyticsTourStepIndex: 0,
                }),
        ),
    }),
);
