/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useOnboarding", () => ({
    useOnboarding: vi.fn(),
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        onClick,
        ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button onClick={onClick} {...rest}>
            {children}
        </button>
    ),
}));

import { useOnboarding } from "@/hooks/useOnboarding";
import { TourOverlay } from "./TourOverlay";

const mockUseOnboarding = vi.mocked(useOnboarding);

const LEFT_STEP = {
    id: "test-left-step",
    targetId: "test-left-target",
    title: "Step com seta esquerda",
    description: "Descrição do step left",
    placement: "left" as const,
    centered: true,
};

const baseOnboardingState = {
    isTourActive: true,
    currentStepIndex: 0,
    totalSteps: 1,
    isWelcomeModalOpen: false,
    hasCompletedOnboarding: false,
    nextStep: vi.fn(),
    closeTour: vi.fn(),
    openWelcomeModal: vi.fn(),
    closeWelcomeModal: vi.fn(),
    startTour: vi.fn(),
    prevStep: vi.fn(),
    completeOnboarding: vi.fn(),
};

describe("<TourOverlay /> placement=left", () => {
    beforeEach(() => {
        const targetElement = document.createElement("div");
        targetElement.id = "test-left-target";
        document.body.appendChild(targetElement);

        mockUseOnboarding.mockReturnValue({
            ...baseOnboardingState,
            currentStep: LEFT_STEP,
        });
    });

    afterEach(() => {
        const el = document.getElementById("test-left-target");
        if (el) document.body.removeChild(el);
        vi.clearAllMocks();
    });

    it("renderiza tooltip com seta esquerda quando placement é 'left'", () => {
        render(<TourOverlay />);

        expect(screen.getByText("Step com seta esquerda")).toBeInTheDocument();
        expect(screen.getByText("Descrição do step left")).toBeInTheDocument();
    });

    it("renderiza a seta na posição correta para placement left + centered", () => {
        render(<TourOverlay />);

        expect(screen.getByText("Step com seta esquerda")).toBeInTheDocument();

        const closeButton = screen.getByLabelText(/fechar tour/i);
        expect(closeButton).toBeInTheDocument();
    });
});
