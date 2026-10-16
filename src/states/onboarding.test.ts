/* @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import {
    ANALYTICS_ONBOARDING_STORAGE_KEY,
    ANALYTICS_TOUR_STEPS,
    ONBOARDING_STORAGE_KEY,
    TOUR_STEPS,
    useOnboardingStore,
} from "./onboarding";

describe("useOnboardingStore (Zustand)", () => {
    beforeEach(() => {
        // Reseta o estado antes de cada teste
        useOnboardingStore.setState({
            isWelcomeModalOpen: false,
            hasCompletedOnboarding: false,
            isTourActive: false,
            currentStepIndex: 0,
        });
        // Limpa o localStorage
        localStorage.clear();
    });

    // ----------------------------
    // Estado inicial
    // ----------------------------

    it("deve ter isWelcomeModalOpen como false inicialmente", () => {
        const state = useOnboardingStore.getState();
        expect(state.isWelcomeModalOpen).toBe(false);
    });

    it("deve ter hasCompletedOnboarding como false inicialmente", () => {
        const state = useOnboardingStore.getState();
        expect(state.hasCompletedOnboarding).toBe(false);
    });

    it("deve ter isTourActive como false inicialmente", () => {
        const state = useOnboardingStore.getState();
        expect(state.isTourActive).toBe(false);
    });

    it("deve ter currentStepIndex como 0 inicialmente", () => {
        const state = useOnboardingStore.getState();
        expect(state.currentStepIndex).toBe(0);
    });

    // ----------------------------
    // Welcome Modal
    // ----------------------------

    it("deve abrir o modal de boas-vindas com openWelcomeModal", () => {
        const { openWelcomeModal } = useOnboardingStore.getState();
        openWelcomeModal();
        expect(useOnboardingStore.getState().isWelcomeModalOpen).toBe(true);
    });

    it("deve fechar o modal de boas-vindas com closeWelcomeModal", () => {
        const { openWelcomeModal, closeWelcomeModal } =
            useOnboardingStore.getState();
        openWelcomeModal();
        expect(useOnboardingStore.getState().isWelcomeModalOpen).toBe(true);
        closeWelcomeModal();
        expect(useOnboardingStore.getState().isWelcomeModalOpen).toBe(false);
    });

    // ----------------------------
    // Tour
    // ----------------------------

    it("deve iniciar o tour com startTour", () => {
        const { openWelcomeModal, startTour } = useOnboardingStore.getState();
        openWelcomeModal();
        startTour();

        const state = useOnboardingStore.getState();
        expect(state.isWelcomeModalOpen).toBe(false);
        expect(state.isTourActive).toBe(true);
        expect(state.currentStepIndex).toBe(0);
    });

    it("deve avançar para o próximo step com nextStep", () => {
        const { startTour, nextStep } = useOnboardingStore.getState();
        startTour();
        nextStep();
        expect(useOnboardingStore.getState().currentStepIndex).toBe(1);
    });

    it("deve voltar para o step anterior com prevStep", () => {
        const { startTour, nextStep, prevStep } = useOnboardingStore.getState();
        startTour();
        nextStep();
        expect(useOnboardingStore.getState().currentStepIndex).toBe(1);
        prevStep();
        expect(useOnboardingStore.getState().currentStepIndex).toBe(0);
    });

    it("não deve voltar além do primeiro step", () => {
        const { startTour, prevStep } = useOnboardingStore.getState();
        startTour();
        prevStep();
        expect(useOnboardingStore.getState().currentStepIndex).toBe(0);
    });

    it("deve completar o onboarding ao chegar no último step e chamar nextStep", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: TOUR_STEPS.length - 1,
        });

        const { nextStep } = useOnboardingStore.getState();
        nextStep();

        const state = useOnboardingStore.getState();
        expect(state.hasCompletedOnboarding).toBe(true);
        expect(state.isTourActive).toBe(false);
    });

    it("deve fechar o tour e completar o onboarding com closeTour", () => {
        const { startTour, closeTour } = useOnboardingStore.getState();
        startTour();
        closeTour();

        const state = useOnboardingStore.getState();
        expect(state.isTourActive).toBe(false);
        expect(state.currentStepIndex).toBe(0);
        expect(state.hasCompletedOnboarding).toBe(true);
    });

    // ----------------------------
    // Complete Onboarding
    // ----------------------------

    it("deve salvar no localStorage ao completar o onboarding", () => {
        const { completeOnboarding } = useOnboardingStore.getState();
        completeOnboarding();

        expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe("true");
    });

    it("deve atualizar todos os estados ao completar o onboarding", () => {
        const { openWelcomeModal, startTour, completeOnboarding } =
            useOnboardingStore.getState();
        openWelcomeModal();
        startTour();
        completeOnboarding();

        const state = useOnboardingStore.getState();
        expect(state.hasCompletedOnboarding).toBe(true);
        expect(state.isWelcomeModalOpen).toBe(false);
        expect(state.isTourActive).toBe(false);
    });

    // ----------------------------
    // TOUR_STEPS
    // ----------------------------

    it("deve ter pelo menos um step definido", () => {
        expect(TOUR_STEPS.length).toBeGreaterThan(0);
    });

    it("cada step deve ter as propriedades obrigatórias", () => {
        TOUR_STEPS.forEach((step) => {
            expect(step).toHaveProperty("id");
            expect(step).toHaveProperty("targetId");
            expect(step).toHaveProperty("title");
            expect(step).toHaveProperty("description");
            expect(step).toHaveProperty("placement");
        });
    });

    it("cada step deve ter placement válido", () => {
        const validPlacements = ["top", "bottom", "left", "right"];
        TOUR_STEPS.forEach((step) => {
            expect(validPlacements).toContain(step.placement);
        });
    });
});

// ----------------------------
// Analytics Tour
// ----------------------------

describe("useOnboardingStore — analytics tour", () => {
    beforeEach(() => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: false,
            analyticsTourStepIndex: 0,
        });
        localStorage.clear();
    });

    it("deve iniciar o tour analytics com startAnalyticsTour", () => {
        useOnboardingStore.getState().startAnalyticsTour();
        const state = useOnboardingStore.getState();
        expect(state.isAnalyticsTourActive).toBe(true);
        expect(state.analyticsTourStepIndex).toBe(0);
    });

    it("deve avançar para o próximo step com nextAnalyticsStep", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        useOnboardingStore.getState().nextAnalyticsStep();
        expect(useOnboardingStore.getState().analyticsTourStepIndex).toBe(1);
    });

    it("deve fechar o tour e salvar localStorage ao chegar no último step com nextAnalyticsStep", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: ANALYTICS_TOUR_STEPS.length - 1,
        });
        useOnboardingStore.getState().nextAnalyticsStep();
        const state = useOnboardingStore.getState();
        expect(state.isAnalyticsTourActive).toBe(false);
        expect(state.analyticsTourStepIndex).toBe(0);
        expect(localStorage.getItem(ANALYTICS_ONBOARDING_STORAGE_KEY)).toBe(
            "true",
        );
    });

    it("deve fechar o tour e salvar localStorage com closeAnalyticsTour", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 2,
        });
        useOnboardingStore.getState().closeAnalyticsTour();
        const state = useOnboardingStore.getState();
        expect(state.isAnalyticsTourActive).toBe(false);
        expect(state.analyticsTourStepIndex).toBe(0);
        expect(localStorage.getItem(ANALYTICS_ONBOARDING_STORAGE_KEY)).toBe(
            "true",
        );
    });

    it("ANALYTICS_TOUR_STEPS deve ter 5 steps com propriedades obrigatórias", () => {
        expect(ANALYTICS_TOUR_STEPS).toHaveLength(5);
        ANALYTICS_TOUR_STEPS.forEach((step) => {
            expect(step).toHaveProperty("id");
            expect(step).toHaveProperty("targetId");
            expect(step).toHaveProperty("title");
            expect(step).toHaveProperty("description");
            expect(step).toHaveProperty("placement");
        });
    });
});
