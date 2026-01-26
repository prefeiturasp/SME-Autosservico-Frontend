/* @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { WelcomeModal } from "./WelcomeModal";
import { useOnboardingStore } from "@/states/onboarding";

describe("<WelcomeModal />", () => {
    beforeEach(() => {
        // Reseta o estado do store antes de cada teste
        useOnboardingStore.setState({
            isWelcomeModalOpen: false,
            hasCompletedOnboarding: false,
            isTourActive: false,
            currentStepIndex: 0,
        });
        localStorage.clear();
    });

    it("deve renderizar o Dialog com open=false quando isWelcomeModalOpen é false", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: false });

        const { container } = render(<WelcomeModal />);

        // Verifica que não há dialog aberto (data-state="open")
        const openDialog = container.querySelector('[data-state="open"]');
        expect(openDialog).toBeNull();
    });

    it("deve renderizar quando isWelcomeModalOpen é true", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: true });

        render(<WelcomeModal />);

        expect(screen.getByText("Olá, seja bem-vindo(a) ao Autosserviço!")).toBeInTheDocument();
    });

    it("deve exibir o título corretamente", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: true });

        render(<WelcomeModal />);

        expect(screen.getByRole("heading", { name: /olá, seja bem-vindo/i })).toBeInTheDocument();
    });

    it("deve exibir o texto de descrição", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: true });

        render(<WelcomeModal />);

        expect(screen.getByText(/aqui você encontrará informações sobre a saúde/i)).toBeInTheDocument();
        expect(screen.getByText(/com o autosserviço buscamos promover autonomia/i)).toBeInTheDocument();
    });

    it("deve exibir o botão de iniciar tour", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: true });

        render(<WelcomeModal />);

        expect(screen.getByRole("button", { name: /iniciar tour/i })).toBeInTheDocument();
    });

    it("deve iniciar o tour ao clicar no botão", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: true });

        render(<WelcomeModal />);

        const button = screen.getByRole("button", { name: /iniciar tour/i });
        fireEvent.click(button);

        const state = useOnboardingStore.getState();
        expect(state.isWelcomeModalOpen).toBe(false);
        expect(state.isTourActive).toBe(true);
    });

    it("deve exibir texto sobre o tour", () => {
        useOnboardingStore.setState({ isWelcomeModalOpen: true });

        render(<WelcomeModal />);

        expect(screen.getByText(/preparamos um pequeno tour/i)).toBeInTheDocument();
        expect(screen.getByText(/vamos iniciar\?/i)).toBeInTheDocument();
    });
});
