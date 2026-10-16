/* @vitest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useOnboarding } from "./useOnboarding";
import { useOnboardingStore, ONBOARDING_STORAGE_KEY, TOUR_STEPS } from "@/states/onboarding";

describe("useOnboarding", () => {
    beforeEach(() => {
        // Reseta o estado do store antes de cada teste
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

    it("deve retornar o estado inicial corretamente", () => {
        const { result } = renderHook(() => useOnboarding());

        expect(result.current.isWelcomeModalOpen).toBe(true); // Abre automaticamente se não completou
        expect(result.current.hasCompletedOnboarding).toBe(false);
        expect(result.current.isTourActive).toBe(false);
        expect(result.current.currentStepIndex).toBe(0);
        expect(result.current.totalSteps).toBe(TOUR_STEPS.length);
    });

    it("deve retornar o currentStep correto", () => {
        const { result } = renderHook(() => useOnboarding());

        expect(result.current.currentStep).toEqual(TOUR_STEPS[0]);
    });

    // ----------------------------
    // Abertura automática do modal
    // ----------------------------

    it("deve abrir o modal automaticamente se o onboarding não foi completado", () => {
        const { result } = renderHook(() => useOnboarding());

        expect(result.current.isWelcomeModalOpen).toBe(true);
    });

    it("não deve abrir o modal se o onboarding já foi completado", () => {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");

        const { result } = renderHook(() => useOnboarding());

        expect(result.current.isWelcomeModalOpen).toBe(false);
    });

    // ----------------------------
    // Ações do modal
    // ----------------------------

    it("deve fechar o modal com closeWelcomeModal", () => {
        const { result } = renderHook(() => useOnboarding());

        expect(result.current.isWelcomeModalOpen).toBe(true);

        act(() => {
            result.current.closeWelcomeModal();
        });

        expect(result.current.isWelcomeModalOpen).toBe(false);
    });

    it("deve abrir o modal com openWelcomeModal", () => {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
        const { result } = renderHook(() => useOnboarding());

        expect(result.current.isWelcomeModalOpen).toBe(false);

        act(() => {
            result.current.openWelcomeModal();
        });

        expect(result.current.isWelcomeModalOpen).toBe(true);
    });

    // ----------------------------
    // Ações do tour
    // ----------------------------

    it("deve iniciar o tour com startTour", () => {
        const { result } = renderHook(() => useOnboarding());

        act(() => {
            result.current.startTour();
        });

        expect(result.current.isWelcomeModalOpen).toBe(false);
        expect(result.current.isTourActive).toBe(true);
        expect(result.current.currentStepIndex).toBe(0);
    });

    it("deve avançar para o próximo step com nextStep", () => {
        const { result } = renderHook(() => useOnboarding());

        act(() => {
            result.current.startTour();
        });

        act(() => {
            result.current.nextStep();
        });

        expect(result.current.currentStepIndex).toBe(1);
        expect(result.current.currentStep).toEqual(TOUR_STEPS[1]);
    });

    it("deve voltar para o step anterior com prevStep", () => {
        const { result } = renderHook(() => useOnboarding());

        act(() => {
            result.current.startTour();
            result.current.nextStep();
        });

        expect(result.current.currentStepIndex).toBe(1);

        act(() => {
            result.current.prevStep();
        });

        expect(result.current.currentStepIndex).toBe(0);
    });

    it("deve fechar o tour com closeTour", () => {
        const { result } = renderHook(() => useOnboarding());

        act(() => {
            result.current.startTour();
        });

        expect(result.current.isTourActive).toBe(true);

        act(() => {
            result.current.closeTour();
        });

        expect(result.current.isTourActive).toBe(false);
        expect(result.current.hasCompletedOnboarding).toBe(true);
    });

    // ----------------------------
    // Completar onboarding
    // ----------------------------

    it("deve completar o onboarding com completeOnboarding", () => {
        const { result } = renderHook(() => useOnboarding());

        act(() => {
            result.current.completeOnboarding();
        });

        expect(result.current.hasCompletedOnboarding).toBe(true);
        expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe("true");
    });

    it("deve completar automaticamente ao passar do último step", () => {
        const { result } = renderHook(() => useOnboarding());

        act(() => {
            result.current.startTour();
        });

        // Avança até o último step
        for (let i = 0; i < TOUR_STEPS.length - 1; i++) {
            act(() => {
                result.current.nextStep();
            });
        }

        expect(result.current.currentStepIndex).toBe(TOUR_STEPS.length - 1);

        // Tenta avançar além do último step
        act(() => {
            result.current.nextStep();
        });

        expect(result.current.hasCompletedOnboarding).toBe(true);
        expect(result.current.isTourActive).toBe(false);
    });
});
