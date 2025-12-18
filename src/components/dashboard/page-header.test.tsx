import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, type Mock as ViMock } from "vitest";

import { PageHeader } from "./page-header";
import useDashboardStore from "@/states/dashboard";

// ✅ Mock do Zustand store
vi.mock("@/states/dashboard", () => {
    return {
        __esModule: true,
        default: vi.fn(),
    };
});

describe("<PageHeader />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o título e subtítulo corretamente quando activeItem está definido", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({
                activeItem: {
                    title: "COPED",
                    subTitle: "Coordenadoria pedagógica",
                    url: "#",
                },
            })
        );

        render(<PageHeader />);

        const header = screen.getByRole("heading", { level: 1 });
        expect(header).toBeInTheDocument();
        expect(header).toHaveTextContent("Coordenadoria pedagógica [COPED]");
    });

    it("não deve renderizar nada quando activeItem é null", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({
                activeItem: null,
            })
        );

        const { container } = render(<PageHeader />);
        expect(container.firstChild).toBeNull();
    });

    it("deve atualizar corretamente se activeItem mudar", () => {
        const mockActiveItem = {
            title: "COTIC",
            subTitle: "Coordenadoria de Tecnologia",
            url: "#",
        };

        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({
                activeItem: mockActiveItem,
            })
        );

        render(<PageHeader />);
        expect(screen.getByText("Coordenadoria de Tecnologia [COTIC]")).toBeInTheDocument();
    });
});
