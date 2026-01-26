/* @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { TourOverlay } from "./TourOverlay";
import { useOnboardingStore, TOUR_STEPS } from "@/states/onboarding";

describe("<TourOverlay />", () => {
    beforeEach(() => {
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
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].title)).toBeInTheDocument();
    });

    it("deve exibir o título do step atual", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].title)).toBeInTheDocument();
    });

    it("deve exibir a descrição do step atual", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        expect(screen.getByText(TOUR_STEPS[0].description)).toBeInTheDocument();
    });

    it("deve exibir o contador de steps", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        expect(screen.getByText(`1/${TOUR_STEPS.length}`)).toBeInTheDocument();
    });

    it("deve exibir o botão Fechar", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    });

    it("deve exibir o botão Próximo quando não é o último step", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        expect(screen.getByRole("button", { name: /próximo/i })).toBeInTheDocument();
    });

    it("deve exibir o botão Concluir no último step", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: TOUR_STEPS.length - 1
        });

        render(<TourOverlay />);

        expect(screen.getByRole("button", { name: /concluir/i })).toBeInTheDocument();
    });

    it("deve avançar para o próximo step ao clicar em Próximo", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        const nextButton = screen.getByRole("button", { name: /próximo/i });
        fireEvent.click(nextButton);

        expect(useOnboardingStore.getState().currentStepIndex).toBe(1);
    });

    it("deve fechar o tour ao clicar em Fechar", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        const closeButton = screen.getByRole("button", { name: "Fechar" });
        fireEvent.click(closeButton);

        expect(useOnboardingStore.getState().isTourActive).toBe(false);
        expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
    });

    it("deve fechar o tour ao clicar no ícone X", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        render(<TourOverlay />);

        const closeIcon = screen.getByLabelText(/fechar tour/i);
        fireEvent.click(closeIcon);

        expect(useOnboardingStore.getState().isTourActive).toBe(false);
    });

    it("deve completar o onboarding ao clicar em Concluir no último step", () => {
        useOnboardingStore.setState({
            isTourActive: true,
            currentStepIndex: TOUR_STEPS.length - 1
        });

        render(<TourOverlay />);

        const concludeButton = screen.getByRole("button", { name: /concluir/i });
        fireEvent.click(concludeButton);

        expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true);
        expect(useOnboardingStore.getState().isTourActive).toBe(false);
    });

    it("deve atualizar o contador ao mudar de step", () => {
        useOnboardingStore.setState({ isTourActive: true, currentStepIndex: 0 });

        const { rerender } = render(<TourOverlay />);
        expect(screen.getByText(`1/${TOUR_STEPS.length}`)).toBeInTheDocument();

        act(() => {
            useOnboardingStore.setState({ currentStepIndex: 1 });
        });
        rerender(<TourOverlay />);

        expect(screen.getByText(`2/${TOUR_STEPS.length}`)).toBeInTheDocument();
    });
});
