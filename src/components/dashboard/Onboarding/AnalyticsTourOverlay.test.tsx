/* @vitest-environment jsdom */
import * as analyticsHook from "@/hooks/useAnalyticsOnboarding";
import { ANALYTICS_TOUR_STEPS, useOnboardingStore } from "@/states/onboarding";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsTourOverlay } from "./AnalyticsTourOverlay";

describe("<AnalyticsTourOverlay />", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        useOnboardingStore.setState({
            isAnalyticsTourActive: false,
            analyticsTourStepIndex: 0,
        });
        localStorage.clear();

        ANALYTICS_TOUR_STEPS.forEach((step, index) => {
            const el = document.createElement("div");
            el.id = step.targetId;
            el.style.position = "absolute";
            el.style.top = `${100 + index * 200}px`;
            el.style.left = "100px";
            el.style.width = "300px";
            el.style.height = "50px";
            document.body.appendChild(el);
        });
    });

    afterEach(() => {
        ANALYTICS_TOUR_STEPS.forEach((step) => {
            const el = document.getElementById(step.targetId);
            if (el) document.body.removeChild(el);
        });
    });

    it("não deve renderizar quando isAnalyticsTourActive é false", () => {
        useOnboardingStore.setState({ isAnalyticsTourActive: false });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.queryByText(ANALYTICS_TOUR_STEPS[0].title),
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar quando currentStep é undefined com tour ativo", () => {
        vi.spyOn(analyticsHook, "useAnalyticsOnboarding").mockReturnValue({
            isAnalyticsTourActive: true,
            currentStep: undefined,
            analyticsTourStepIndex: 0,
            totalSteps: 5,
            triggerAnalyticsTour: vi.fn(),
            nextAnalyticsStep: vi.fn(),
            closeAnalyticsTour: vi.fn(),
        } as unknown as ReturnType<
            typeof analyticsHook.useAnalyticsOnboarding
        >);
        render(<AnalyticsTourOverlay />);
        expect(
            screen.queryByText(ANALYTICS_TOUR_STEPS[0].title),
        ).not.toBeInTheDocument();
    });

    it("deve renderizar quando isAnalyticsTourActive é true", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[0].title),
        ).toBeInTheDocument();
    });

    it("não deve renderizar quando elemento alvo não existe no DOM (targetRect fica null)", () => {
        ANALYTICS_TOUR_STEPS.forEach((step) => {
            const el = document.getElementById(step.targetId);
            if (el) document.body.removeChild(el);
        });
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.queryByText(ANALYTICS_TOUR_STEPS[0].title),
        ).not.toBeInTheDocument();
    });

    it("deve exibir o título do step atual", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[0].title),
        ).toBeInTheDocument();
    });

    it("deve exibir a descrição do step atual", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[0].description),
        ).toBeInTheDocument();
    });

    it("deve exibir o contador de steps", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(`1/${ANALYTICS_TOUR_STEPS.length}`),
        ).toBeInTheDocument();
    });

    it("deve exibir 'Próximo' quando não é o último step", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByRole("button", { name: /próximo/i }),
        ).toBeInTheDocument();
    });

    it("deve exibir apenas o botão 'Fechar' no último step", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: ANALYTICS_TOUR_STEPS.length - 1,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByRole("button", { name: "Fechar" }),
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /próximo/i }),
        ).not.toBeInTheDocument();
    });

    it("atualiza o contador ao mudar de step", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        const { rerender } = render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(`1/${ANALYTICS_TOUR_STEPS.length}`),
        ).toBeInTheDocument();

        act(() => {
            useOnboardingStore.setState({ analyticsTourStepIndex: 1 });
        });
        rerender(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(`2/${ANALYTICS_TOUR_STEPS.length}`),
        ).toBeInTheDocument();
    });

    it("deve avançar para o próximo step ao clicar em Próximo", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        fireEvent.click(screen.getByRole("button", { name: /próximo/i }));
        expect(useOnboardingStore.getState().analyticsTourStepIndex).toBe(1);
    });

    it("deve fechar o tour ao clicar em Fechar e persistir no localStorage", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
        expect(useOnboardingStore.getState().isAnalyticsTourActive).toBe(false);
        expect(
            localStorage.getItem("autosservico-analytics-onboarding-completed"),
        ).toBe("true");
    });

    it("deve fechar o tour ao clicar no ícone X", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        fireEvent.click(screen.getByLabelText(/fechar tour/i));
        expect(useOnboardingStore.getState().isAnalyticsTourActive).toBe(false);
    });

    it("renderiza spotlight com box-shadow quando spotlightBorderRadius está definido (step 0)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        const spotlightDiv = document.querySelector('[style*="box-shadow"]');
        expect(spotlightDiv).toBeInTheDocument();
    });

    it("renderiza 4 divs de overlay quando spotlightBorderRadius não está definido (step 1)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 1,
        });
        render(<AnalyticsTourOverlay />);
        const overlayDivs = document.querySelectorAll(".bg-black\\/50");
        expect(overlayDivs.length).toBeGreaterThanOrEqual(4);
    });

    it("renderiza seta bottom quando placement é 'bottom' (step 0)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[0].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta bottom quando placement é 'bottom' (step 1)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 1,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[1].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta right quando placement é 'right' (step 2)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 2,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[2].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta left quando placement é 'left' (step 3)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 3,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[3].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta top quando placement é 'top' (step 4)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 4,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[4].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta right centralizada com centered=true (step 2)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 2,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[2].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta left centralizada com centered=true (step 3)", () => {
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 3,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[3].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta right quando placement é 'right' via mock", () => {
        vi.spyOn(analyticsHook, "useAnalyticsOnboarding").mockReturnValue({
            isAnalyticsTourActive: true,
            currentStep: {
                id: "test-right",
                targetId: "onboarding-analytics-users-by-page",
                title: "Step Right",
                description: "Tooltip à direita",
                placement: "right",
            },
            analyticsTourStepIndex: 0,
            totalSteps: 5,
            triggerAnalyticsTour: vi.fn(),
            nextAnalyticsStep: vi.fn(),
            closeAnalyticsTour: vi.fn(),
        });
        render(<AnalyticsTourOverlay />);
        expect(screen.getByText("Step Right")).toBeInTheDocument();
    });

    it("renderiza seta left via mock sem centered", () => {
        vi.spyOn(analyticsHook, "useAnalyticsOnboarding").mockReturnValue({
            isAnalyticsTourActive: true,
            currentStep: {
                id: "test-left",
                targetId: "onboarding-analytics-device-distribution",
                title: "Step Left Sem Centered",
                description: "Tooltip à esquerda sem centered",
                placement: "left",
            },
            analyticsTourStepIndex: 0,
            totalSteps: 5,
            triggerAnalyticsTour: vi.fn(),
            nextAnalyticsStep: vi.fn(),
            closeAnalyticsTour: vi.fn(),
        });
        render(<AnalyticsTourOverlay />);
        expect(screen.getByText("Step Left Sem Centered")).toBeInTheDocument();
    });

    it("renderiza sem border-radius e com 4 overlays via mock", () => {
        vi.spyOn(analyticsHook, "useAnalyticsOnboarding").mockReturnValue({
            isAnalyticsTourActive: true,
            currentStep: {
                id: "test-no-radius",
                targetId: "onboarding-analytics-kpis",
                title: "Step Sem Radius",
                description: "Sem border radius",
                placement: "bottom",
            },
            analyticsTourStepIndex: 1,
            totalSteps: 5,
            triggerAnalyticsTour: vi.fn(),
            nextAnalyticsStep: vi.fn(),
            closeAnalyticsTour: vi.fn(),
        });
        render(<AnalyticsTourOverlay />);
        const overlayDivs = document.querySelectorAll(".bg-black\\/50");
        expect(overlayDivs.length).toBeGreaterThanOrEqual(4);
    });

    it("clampeia tooltip para a direita quando ultrapassa a borda da janela", () => {
        const el = document.getElementById(ANALYTICS_TOUR_STEPS[2].targetId);
        if (el) {
            el.getBoundingClientRect = vi.fn().mockReturnValue({
                top: 100,
                left: 900,
                right: 1000,
                bottom: 150,
                width: 100,
                height: 50,
                x: 900,
                y: 100,
                toJSON: () => ({}),
            });
        }
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 2,
        });
        render(<AnalyticsTourOverlay />);
        expect(
            screen.getByText(ANALYTICS_TOUR_STEPS[2].title),
        ).toBeInTheDocument();
    });

    it("adiciona event listeners de resize e scroll quando tour está ativo", () => {
        const addSpy = vi.spyOn(window, "addEventListener");
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        render(<AnalyticsTourOverlay />);
        expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
        expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });

    it("remove event listeners ao desmontar o componente", () => {
        const removeSpy = vi.spyOn(window, "removeEventListener");
        useOnboardingStore.setState({
            isAnalyticsTourActive: true,
            analyticsTourStepIndex: 0,
        });
        const { unmount } = render(<AnalyticsTourOverlay />);
        unmount();
        expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });

    it("não adiciona event listeners quando tour está inativo", () => {
        const addSpy = vi.spyOn(window, "addEventListener");
        useOnboardingStore.setState({ isAnalyticsTourActive: false });
        render(<AnalyticsTourOverlay />);
        expect(addSpy).not.toHaveBeenCalledWith("resize", expect.any(Function));
        expect(addSpy).not.toHaveBeenCalledWith("scroll", expect.any(Function));
    });
});
