/* @vitest-environment jsdom */
import * as deployHealthHook from "@/hooks/useDeployHealthOnboarding";
import {
    DEPLOY_HEALTH_TOUR_STEPS,
    useOnboardingStore,
} from "@/states/onboarding";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeployHealthTourOverlay } from "./DeployHealthTourOverlay";

describe("<DeployHealthTourOverlay />", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        useOnboardingStore.setState({
            isDeployTourActive: false,
            deployTourStepIndex: 0,
        });
        localStorage.clear();

        DEPLOY_HEALTH_TOUR_STEPS.forEach((step, index) => {
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
        DEPLOY_HEALTH_TOUR_STEPS.forEach((step) => {
            const el = document.getElementById(step.targetId);
            if (el) document.body.removeChild(el);
        });
    });

    it("não deve renderizar quando isDeployTourActive é false", () => {
        useOnboardingStore.setState({ isDeployTourActive: false });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.queryByText(DEPLOY_HEALTH_TOUR_STEPS[0].title),
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar quando currentStep é undefined com tour ativo", () => {
        vi.spyOn(deployHealthHook, "useDeployHealthOnboarding").mockReturnValue(
            {
                isDeployTourActive: true,
                currentStep: undefined,
                deployTourStepIndex: 0,
                totalSteps: 3,
                triggerDeployTour: vi.fn(),
                nextDeployStep: vi.fn(),
                closeDeployTour: vi.fn(),
            } as unknown as ReturnType<
                typeof deployHealthHook.useDeployHealthOnboarding
            >,
        );
        render(<DeployHealthTourOverlay />);
        expect(
            screen.queryByText(DEPLOY_HEALTH_TOUR_STEPS[0].title),
        ).not.toBeInTheDocument();
    });

    it("deve renderizar quando isDeployTourActive é true", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[0].title),
        ).toBeInTheDocument();
    });

    it("não deve renderizar quando elemento alvo não existe no DOM (targetRect fica null)", () => {
        DEPLOY_HEALTH_TOUR_STEPS.forEach((step) => {
            const el = document.getElementById(step.targetId);
            if (el) document.body.removeChild(el);
        });
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.queryByText(DEPLOY_HEALTH_TOUR_STEPS[0].title),
        ).not.toBeInTheDocument();
    });

    it("deve exibir o título do step atual", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[0].title),
        ).toBeInTheDocument();
    });

    it("deve exibir a descrição do step atual", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[0].description),
        ).toBeInTheDocument();
    });

    it("deve exibir o contador de steps", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(`1/${DEPLOY_HEALTH_TOUR_STEPS.length}`),
        ).toBeInTheDocument();
    });

    it("deve exibir 'Próximo' quando não é o último step", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByRole("button", { name: /próximo/i }),
        ).toBeInTheDocument();
    });

    it("deve exibir 'Concluir' no último step", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: DEPLOY_HEALTH_TOUR_STEPS.length - 1,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByRole("button", { name: /concluir/i }),
        ).toBeInTheDocument();
    });

    it("atualiza o contador ao mudar de step", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        const { rerender } = render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(`1/${DEPLOY_HEALTH_TOUR_STEPS.length}`),
        ).toBeInTheDocument();

        act(() => {
            useOnboardingStore.setState({ deployTourStepIndex: 1 });
        });
        rerender(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(`2/${DEPLOY_HEALTH_TOUR_STEPS.length}`),
        ).toBeInTheDocument();
    });

    it("deve avançar para o próximo step ao clicar em Próximo", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        fireEvent.click(screen.getByRole("button", { name: /próximo/i }));
        expect(useOnboardingStore.getState().deployTourStepIndex).toBe(1);
    });

    it("deve fechar o tour ao clicar em Fechar e persistir no localStorage", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
        expect(useOnboardingStore.getState().isDeployTourActive).toBe(false);
        expect(
            localStorage.getItem("autosservico-deploy-onboarding-completed"),
        ).toBe("true");
    });

    it("deve fechar o tour ao clicar no ícone X", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        fireEvent.click(screen.getByLabelText(/fechar tour/i));
        expect(useOnboardingStore.getState().isDeployTourActive).toBe(false);
    });

    it("renderiza spotlight com box-shadow quando spotlightBorderRadius está definido (step 0)", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        const spotlightDiv = document.querySelector('[style*="box-shadow"]');
        expect(spotlightDiv).toBeInTheDocument();
    });

    it("renderiza 4 divs de overlay quando spotlightBorderRadius não está definido", () => {
        vi.spyOn(deployHealthHook, "useDeployHealthOnboarding").mockReturnValue(
            {
                isDeployTourActive: true,
                currentStep: {
                    id: "test-no-radius",
                    targetId: "onboarding-lancamentos",
                    title: "Step Sem Radius",
                    description: "Sem border radius",
                    placement: "right",
                },
                deployTourStepIndex: 1,
                totalSteps: 3,
                triggerDeployTour: vi.fn(),
                nextDeployStep: vi.fn(),
                closeDeployTour: vi.fn(),
            },
        );
        render(<DeployHealthTourOverlay />);
        const overlayDivs = document.querySelectorAll(".bg-black\\/50");
        expect(overlayDivs.length).toBeGreaterThanOrEqual(4);
    });

    it("renderiza seta bottom quando placement é 'bottom' (step 0)", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[0].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta right quando placement é 'right' (step 1)", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 1,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[1].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta top quando placement é 'top' (step 2)", () => {
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 2,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[2].title),
        ).toBeInTheDocument();
    });

    it("renderiza seta left quando placement é 'left'", () => {
        vi.spyOn(deployHealthHook, "useDeployHealthOnboarding").mockReturnValue(
            {
                isDeployTourActive: true,
                currentStep: {
                    id: "test-left",
                    targetId: "onboarding-lancamentos",
                    title: "Step Left",
                    description: "Tooltip à esquerda",
                    placement: "left",
                },
                deployTourStepIndex: 0,
                totalSteps: 3,
                triggerDeployTour: vi.fn(),
                nextDeployStep: vi.fn(),
                closeDeployTour: vi.fn(),
            },
        );
        render(<DeployHealthTourOverlay />);
        expect(screen.getByText("Step Left")).toBeInTheDocument();
    });

    it("renderiza seta left centralizada com centered=true", () => {
        vi.spyOn(deployHealthHook, "useDeployHealthOnboarding").mockReturnValue(
            {
                isDeployTourActive: true,
                currentStep: {
                    id: "test-centered-left",
                    targetId: "onboarding-lancamentos",
                    title: "Step Centered Left",
                    description: "Tooltip centralizado à esquerda",
                    placement: "left",
                    centered: true,
                },
                deployTourStepIndex: 0,
                totalSteps: 3,
                triggerDeployTour: vi.fn(),
                nextDeployStep: vi.fn(),
                closeDeployTour: vi.fn(),
            },
        );
        render(<DeployHealthTourOverlay />);
        expect(screen.getByText("Step Centered Left")).toBeInTheDocument();
    });

    it("renderiza seta right centralizada com centered=true", () => {
        vi.spyOn(deployHealthHook, "useDeployHealthOnboarding").mockReturnValue(
            {
                isDeployTourActive: true,
                currentStep: {
                    id: "test-centered-right",
                    targetId: "onboarding-lancamentos",
                    title: "Step Centered Right",
                    description: "Tooltip centralizado à direita",
                    placement: "right",
                    centered: true,
                },
                deployTourStepIndex: 1,
                totalSteps: 3,
                triggerDeployTour: vi.fn(),
                nextDeployStep: vi.fn(),
                closeDeployTour: vi.fn(),
            },
        );
        render(<DeployHealthTourOverlay />);
        expect(screen.getByText("Step Centered Right")).toBeInTheDocument();
    });

    it("clampeia tooltip para a direita quando ultrapassa a borda da janela", () => {
        const el = document.getElementById(
            DEPLOY_HEALTH_TOUR_STEPS[1].targetId,
        );
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
            isDeployTourActive: true,
            deployTourStepIndex: 1,
        });
        render(<DeployHealthTourOverlay />);
        expect(
            screen.getByText(DEPLOY_HEALTH_TOUR_STEPS[1].title),
        ).toBeInTheDocument();
    });

    it("adiciona event listeners de resize e scroll quando tour está ativo", () => {
        const addSpy = vi.spyOn(window, "addEventListener");
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        render(<DeployHealthTourOverlay />);
        expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
        expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });

    it("remove event listeners ao desmontar o componente", () => {
        const removeSpy = vi.spyOn(window, "removeEventListener");
        useOnboardingStore.setState({
            isDeployTourActive: true,
            deployTourStepIndex: 0,
        });
        const { unmount } = render(<DeployHealthTourOverlay />);
        unmount();
        expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    });

    it("não adiciona event listeners quando tour está inativo", () => {
        const addSpy = vi.spyOn(window, "addEventListener");
        useOnboardingStore.setState({ isDeployTourActive: false });
        render(<DeployHealthTourOverlay />);
        expect(addSpy).not.toHaveBeenCalledWith("resize", expect.any(Function));
        expect(addSpy).not.toHaveBeenCalledWith("scroll", expect.any(Function));
    });
});
