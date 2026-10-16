/* @vitest-environment jsdom */
import * as useOnboardingHook from "@/hooks/useOnboarding";
import { TOUR_STEPS, useOnboardingStore } from "@/states/onboarding";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TourOverlay } from "./TourOverlay";

describe("<TourOverlay />", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        // Reseta o estado do store antes de cada teste
        useOnboardingStore.setState({
            isWelcomeModalOpen: false,
            hasCompletedOnboarding: false,
            isTourActive: false,
            currentStepIndex: 0,
        });
        localStorage.clear();

        // Cria elementos target para todos os steps do tour
        TOUR_STEPS.forEach((step, index) => {
            const targetElement = document.createElement("div");
            targetElement.id = step.targetId;
            targetElement.style.position = "absolute";
            targetElement.style.top = `${100 + index * 100}px`;
            targetElement.style.left = "100px";
            targetElement.style.width = "200px";
            targetElement.style.height = "50px";
            document.body.appendChild(targetElement);
        });
    });

    afterEach(() => {
        // Remove todos os elementos target após cada teste
        TOUR_STEPS.forEach((step) => {
            const targetElement = document.getElementById(step.targetId);
            if (targetElement) {
                document.body.removeChild(targetElement);
            }
        });
    });

    it("não deve renderizar quando isTourActive é false", () => {
        useOnboardingStore.setState({ isTourActive: false });

        render(<TourOverlay />);

        expect(screen.queryByText(TOUR_STEPS[0].title)).not.toBeInTheDocument();
    });

    it("deve renderizar quando isTourActive é true", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].title)).toBeInTheDocument();
    });

    it("deve exibir o título do step atual", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].title)).toBeInTheDocument();
    });

    it("deve exibir a descrição do step atual", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].description)).toBeInTheDocument();
    });

    it("deve exibir o contador de steps", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        expect(screen.getByText(`1/${TOUR_STEPS.length}`)).toBeInTheDocument();
    });

    it("deve exibir o botão Fechar", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        expect(
            screen.getByRole("button", { name: "Fechar" }),
        ).toBeInTheDocument();
    });

    it("deve exibir o botão Próximo quando não é o último step", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        expect(
            screen.getByRole("button", { name: /próximo/i }),
        ).toBeInTheDocument();
    });

    it("deve exibir o botão Concluir no último step", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: TOUR_STEPS.length - 1,
        });

        render(<TourOverlay />);

        expect(
            screen.getByRole("button", { name: /concluir/i }),
        ).toBeInTheDocument();
    });

    it("deve avançar para o próximo step ao clicar em Próximo", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        const nextButton = screen.getByRole("button", { name: /próximo/i });
        fireEvent.click(nextButton);

        expect(useOnboardingStore.getState().currentStepIndex).toBe(1);
    });

    it("deve fechar o tour ao clicar em Fechar", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        const closeButton = screen.getByRole("button", { name: "Fechar" });
        fireEvent.click(closeButton);

        expect(useOnboardingStore.getState().isTourActive).toBe(false);
        expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
    });

    it("deve fechar o tour ao clicar no ícone X", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        render(<TourOverlay />);

        const closeIcon = screen.getByLabelText(/fechar tour/i);
        fireEvent.click(closeIcon);

        expect(useOnboardingStore.getState().isTourActive).toBe(false);
    });

    it("deve completar o onboarding ao clicar em Concluir no último step", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: TOUR_STEPS.length - 1,
        });

        render(<TourOverlay />);

        const concludeButton = screen.getByRole("button", {
            name: /concluir/i,
        });
        fireEvent.click(concludeButton);

        expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
        expect(useOnboardingStore.getState().isTourActive).toBe(false);
    });

    it("deve atualizar o contador ao mudar de step", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        const { rerender } = render(<TourOverlay />);
        expect(screen.getByText(`1/${TOUR_STEPS.length}`)).toBeInTheDocument();

        act(() => {
            useOnboardingStore.setState({ currentStepIndex: 1 });
        });
        rerender(<TourOverlay />);

        expect(screen.getByText(`2/${TOUR_STEPS.length}`)).toBeInTheDocument();
    });

    it("renderiza corretamente no step 3 (placement right + centered)", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 3,
        });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[3].title)).toBeInTheDocument();
        expect(screen.getByText(TOUR_STEPS[3].description)).toBeInTheDocument();
        expect(screen.getByText(`4/${TOUR_STEPS.length}`)).toBeInTheDocument();
    });

    it("updateTargetPosition retorna cedo quando currentStep é undefined — cobre L31", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: TOUR_STEPS.length,
        });

        render(<TourOverlay />);

        expect(screen.queryByText(TOUR_STEPS[0].title)).not.toBeInTheDocument();
    });

    it("renderiza seta esquerda com placement='left' e centered=true", () => {
        vi.spyOn(useOnboardingHook, "useOnboarding").mockReturnValue({
            isTourActive: true,
            currentStep: {
                id: "test-left",
                targetId: "onboarding-page-title",
                title: "Step Esquerda",
                description: "Tooltip posicionado à esquerda",
                placement: "left",
                centered: true,
            },
            currentStepIndex: 0,
            totalSteps: TOUR_STEPS.length,
            nextStep: vi.fn(),
            closeTour: vi.fn(),
        } as unknown as ReturnType<typeof useOnboardingHook.useOnboarding>);

        render(<TourOverlay />);

        expect(screen.getByText("Step Esquerda")).toBeInTheDocument();
    });

    it("renderiza seta esquerda sem centralização quando centered é false", () => {
        vi.spyOn(useOnboardingHook, "useOnboarding").mockReturnValue({
            isTourActive: true,
            currentStep: {
                id: "test-left-no-centered",
                targetId: "onboarding-page-title",
                title: "Step Esquerda Sem Centered",
                description: "Tooltip à esquerda sem centralização",
                placement: "left",
            },
            currentStepIndex: 0,
            totalSteps: TOUR_STEPS.length,
            nextStep: vi.fn(),
            closeTour: vi.fn(),
        } as unknown as ReturnType<typeof useOnboardingHook.useOnboarding>);

        render(<TourOverlay />);

        expect(
            screen.getByText("Step Esquerda Sem Centered"),
        ).toBeInTheDocument();
    });

    it("clamp o tooltip à borda direita quando a posição excede a largura da viewport", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: 0,
        });

        const target = document.getElementById(TOUR_STEPS[0].targetId)!;
        target.getBoundingClientRect = () => ({
            top: 0,
            left: 700,
            width: 200,
            height: 50,
            right: 900,
            bottom: 50,
            x: 700,
            y: 0,
            toJSON: () => {},
        });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].title)).toBeInTheDocument();
    });
});
