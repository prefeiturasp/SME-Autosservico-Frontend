/* @vitest-environment jsdom */
import {
    ANALYTICS_ONBOARDING_STORAGE_KEY,
    ANALYTICS_TOUR_STEPS,
    useOnboardingStore,
} from "@/states/onboarding";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnalyticsOnboarding } from "./useAnalyticsOnboarding";

describe("useAnalyticsOnboarding", () => {
    beforeEach(() => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: false,
            analyticsTourStepIndex: 0,
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
        const { result } = renderHook(() => useAnalyticsOnboarding());

        expect(result.current.isAnalyticsTourActive).toBe(false);
        expect(result.current.analyticsTourStepIndex).toBe(0);
        expect(result.current.totalSteps).toBe(ANALYTICS_TOUR_STEPS.length);
        expect(result.current.currentStep).toEqual(ANALYTICS_TOUR_STEPS[0]);
    });

    // ----------------------------
    // triggerAnalyticsTour
    // ----------------------------

    it("deve iniciar o tour quando o onboarding analytics não foi completado", () => {
        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.triggerAnalyticsTour();
        });

        expect(result.current.isAnalyticsTourActive).toBe(true);
        expect(result.current.analyticsTourStepIndex).toBe(0);
    });

    it("não deve iniciar o tour em ambiente de servidor (window undefined)", () => {
        const { result } = renderHook(() => useAnalyticsOnboarding());

        vi.stubGlobal("window", undefined);

        act(() => {
            result.current.triggerAnalyticsTour();
        });

        expect(result.current.isAnalyticsTourActive).toBe(false);
    });

    it("não deve iniciar o tour quando o onboarding analytics já foi completado", () => {
        localStorage.setItem(ANALYTICS_ONBOARDING_STORAGE_KEY, "true");

        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.triggerAnalyticsTour();
        });

        expect(result.current.isAnalyticsTourActive).toBe(false);
    });

    // ----------------------------
    // Navegação — nextAnalyticsStep
    // ----------------------------

    it("deve avançar para o próximo passo com nextAnalyticsStep", () => {
        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.triggerAnalyticsTour();
        });

        act(() => {
            result.current.nextAnalyticsStep();
        });

        expect(result.current.analyticsTourStepIndex).toBe(1);
        expect(result.current.currentStep).toEqual(ANALYTICS_TOUR_STEPS[1]);
    });

    it("deve encerrar o tour e persistir no localStorage ao avançar do último passo", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: ANALYTICS_TOUR_STEPS.length - 1,
        });

        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.nextAnalyticsStep();
        });

        expect(result.current.isAnalyticsTourActive).toBe(false);
        expect(result.current.analyticsTourStepIndex).toBe(0);
        expect(localStorage.getItem(ANALYTICS_ONBOARDING_STORAGE_KEY)).toBe(
            "true",
        );
    });

    // ----------------------------
    // Fechamento — closeAnalyticsTour
    // ----------------------------

    it("deve encerrar o tour com closeAnalyticsTour", () => {
        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.triggerAnalyticsTour();
        });

        expect(result.current.isAnalyticsTourActive).toBe(true);

        act(() => {
            result.current.closeAnalyticsTour();
        });

        expect(result.current.isAnalyticsTourActive).toBe(false);
    });

    it("deve persistir no localStorage ao fechar o tour", () => {
        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.triggerAnalyticsTour();
            result.current.closeAnalyticsTour();
        });

        expect(localStorage.getItem(ANALYTICS_ONBOARDING_STORAGE_KEY)).toBe(
            "true",
        );
    });

    it("não deve reabrir o tour após fechar (persistência)", () => {
        const { result } = renderHook(() => useAnalyticsOnboarding());

        act(() => {
            result.current.triggerAnalyticsTour();
            result.current.closeAnalyticsTour();
        });

        act(() => {
            result.current.triggerAnalyticsTour();
        });

        expect(result.current.isAnalyticsTourActive).toBe(false);
    });
});
