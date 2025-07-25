import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, type Mock as ViMock } from "vitest";

import { SelectSistemas } from "./index";
import useDashboardStore from "@/states/dashboard";

import { getSistemasPorSquad } from "./getSistemasPorSquad";

// ✅ Mock do Zustand store
vi.mock("@/states/dashboard", () => {
    return {
        __esModule: true,
        default: vi.fn(),
    };
});

// ✅ Mock do hook useView
const mockHandleSelectChange = vi.fn();
vi.mock("./view", () => {
    return {
        __esModule: true,
        default: vi.fn(() => ({
            handleSelectChange: mockHandleSelectChange,
        })),
    };
});

// ✅ Mock do getSistemasPorSquad
vi.mock("./getSistemasPorSquad", () => {
    return {
        __esModule: true,
        getSistemasPorSquad: vi.fn(),
    };
});

describe("<SelectSistemas />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve renderizar nada quando activeItem é null", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({ activeItem: null })
        );

        const { container } = render(<SelectSistemas />);
        expect(container.firstChild).toBeNull();
    });

    it("deve renderizar corretamente os sistemas e chamar handleSelectChange com o primeiro sistema ao montar", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({
                activeItem: {
                    title: "COPED",
                    subTitle: "Coordenadoria pedagógica",
                    url: "#",
                },
            })
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([
            { id: "10", nome: "Novo SGP" },
            { id: "11", nome: "Serap" },
        ]);

        render(<SelectSistemas />);

        // ✅ Renderização do título e instruções
        expect(screen.getByText("Sistema")).toBeInTheDocument();
        expect(
            screen.getByText("Selecione um sistema para visualizar as informações")
        ).toBeInTheDocument();

        // ✅ Renderiza os sistemas
        expect(screen.getByText("Novo SGP")).toBeInTheDocument();

        // ✅ handleSelectChange deve ser chamado automaticamente com o primeiro sistema
        expect(mockHandleSelectChange).toHaveBeenCalledWith("10");
    });

    it("deve atualizar o sistema selecionado ao escolher outro item", async () => {
        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({
                activeItem: {
                    title: "COPED",
                    subTitle: "Coordenadoria pedagógica",
                    url: "#",
                },
            })
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([
            { id: "10", nome: "Novo SGP" },
            { id: "11", nome: "Serap" },
        ]);

        render(<SelectSistemas />);

        // Abre o dropdown
        const trigger = screen.getByRole("combobox");
        fireEvent.click(trigger);

        // Clica no segundo sistema
        fireEvent.click(screen.getByText("Serap"));

        // ✅ handleSelectChange deve ser chamado com o segundo sistema
        expect(mockHandleSelectChange).toHaveBeenCalledWith("11");
    });

    it("deve resetar o valor quando não houver sistemas disponíveis", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation((selector) =>
            selector({
                activeItem: {
                    title: "COTIC",
                    subTitle: "Coordenadoria de Tecnologia",
                    url: "#",
                },
            })
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([]);

        render(<SelectSistemas />);

        expect(mockHandleSelectChange).not.toHaveBeenCalled();
        expect(screen.queryByRole("combobox")).toBeInTheDocument();
        expect(screen.queryByText("Nenhum sistema")).not.toBeInTheDocument();
    });
});
