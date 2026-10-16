/* @vitest-environment jsdom */
import {
    DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY,
    DEPLOY_HEALTH_TOUR_STEPS,
    useOnboardingStore,
} from "@/states/onboarding";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDeployHealthOnboarding } from "./useDeployHealthOnboarding";

describe("useDeployHealthOnboarding", () => {
    beforeEach(() => {
        useOnboardingStore.setState({
            isDeployTourActive: false,
            deployTourStepIndex: 0,
        });
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // ----------------------------
    // Estado inicial
    // ----------------------------

    it("deve retornar o estado inicial corretamente", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        expect(result.current.isDeployTourActive).toBe(false);
        expect(result.current.deployTourStepIndex).toBe(0);
        expect(result.current.totalSteps).toBe(DEPLOY_HEALTH_TOUR_STEPS.length);
        expect(result.current.currentStep).toEqual(DEPLOY_HEALTH_TOUR_STEPS[0]);
    });

    // ----------------------------
    // triggerDeployTour
    // ----------------------------

    it("deve iniciar o tour quando o onboarding de deploy não foi completado", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
        });

        expect(result.current.isDeployTourActive).toBe(true);
        expect(result.current.deployTourStepIndex).toBe(0);
    });

    it("não deve iniciar o tour em ambiente de servidor (window undefined)", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        vi.stubGlobal("window", undefined);

        act(() => {
            result.current.triggerDeployTour();
        });

        expect(result.current.isDeployTourActive).toBe(false);
    });

    it("não deve iniciar o tour quando o onboarding de deploy já foi completado", () => {
        localStorage.setItem(DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY, "true");

        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
        });

        expect(result.current.isDeployTourActive).toBe(false);
    });

    // ----------------------------
    // Navegação — nextDeployStep
    // ----------------------------

    it("deve avançar para o próximo passo com nextDeployStep", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
        });

        act(() => {
            result.current.nextDeployStep();
        });

        expect(result.current.deployTourStepIndex).toBe(1);
        expect(result.current.currentStep).toEqual(DEPLOY_HEALTH_TOUR_STEPS[1]);
    });

    it("deve encerrar o tour e persistir no localStorage ao avançar do último passo", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: DEPLOY_HEALTH_TOUR_STEPS.length - 1,
        });

        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.nextDeployStep();
        });

        expect(result.current.isDeployTourActive).toBe(false);
        expect(result.current.deployTourStepIndex).toBe(0);
        expect(localStorage.getItem(DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY)).toBe(
            "true",
        );
    });

    // ----------------------------
    // Fechamento — closeDeployTour
    // ----------------------------

    it("deve encerrar o tour com closeDeployTour", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
        });

        expect(result.current.isDeployTourActive).toBe(true);

        act(() => {
            result.current.closeDeployTour();
        });

        expect(result.current.isDeployTourActive).toBe(false);
    });

    it("deve persistir no localStorage ao fechar o tour", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
            result.current.closeDeployTour();
        });

        expect(localStorage.getItem(DEPLOY_HEALTH_ONBOARDING_STORAGE_KEY)).toBe(
            "true",
        );
    });

    it("não deve reabrir o tour após fechar (persistência)", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
            result.current.closeDeployTour();
        });

        act(() => {
            result.current.triggerDeployTour();
        });

        expect(result.current.isDeployTourActive).toBe(false);
    });

    // ----------------------------
    // Passos do tour
    // ----------------------------

    it("deve expor o total de passos correto", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        expect(result.current.totalSteps).toBe(3);
    });

    it("deve retornar o passo correto para cada índice", () => {
        const { result } = renderHook(() => useDeployHealthOnboarding());

        act(() => {
            result.current.triggerDeployTour();
        });

        expect(result.current.currentStep.id).toBe(
            "deploy-environment-switcher",
        );
        expect(result.current.currentStep.targetId).toBe(
            "onboarding-environment-switcher",
        );

        act(() => {
            result.current.nextDeployStep();
        });

        expect(result.current.currentStep.id).toBe("deploy-jenkins");
        expect(result.current.currentStep.targetId).toBe(
            "onboarding-lancamentos",
        );

        act(() => {
            result.current.nextDeployStep();
        });

        expect(result.current.currentStep.id).toBe("deploy-sonar-quality");
        expect(result.current.currentStep.targetId).toBe(
            "onboarding-sonar-quality",
        );
    });
});
