import type { ProfileBreakdownBlock } from "@/types/metricas";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/skeleton", () => ({
    Skeleton: (props: Readonly<React.HTMLAttributes<HTMLDivElement>>) => (
        <div data-testid="skeleton" {...props} />
    ),
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        ...rest
    }: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
        <button data-testid="retry-button" {...rest}>
            {children}
        </button>
    ),
}));

type MockQueryResult = {
    data?: ProfileBreakdownBlock[];
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
};

let mockQueryResult: MockQueryResult = {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
};

vi.mock("@/hooks/usePerfilResponsaveisUps", () => ({
    usePerfilResponsaveisUps: () => mockQueryResult,
}));

import PerfilResponsaveisUpsCard from "./PerfilResponsaveisUpsCard";

describe("<PerfilResponsaveisUpsCard />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockQueryResult = {
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        };
    });

    it("sem systemName mostra placeholder", () => {
        render(<PerfilResponsaveisUpsCard />);
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("loading mostra skeletons", () => {
        mockQueryResult = { ...mockQueryResult, isLoading: true };
        render(<PerfilResponsaveisUpsCard systemName="Rolê Agroecológico" />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            1,
        );
    });

    it("erro mostra mensagem e botão de retry", async () => {
        const refetch = vi.fn();
        mockQueryResult = { ...mockQueryResult, isError: true, refetch };
        render(<PerfilResponsaveisUpsCard systemName="Rolê Agroecológico" />);

        expect(
            screen.getByText(
                "Não foi possível carregar o perfil dos responsáveis pelas UPs.",
            ),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("retry-button"));
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("sucesso renderiza os blocos mockados, incluindo 'Raça'", () => {
        mockQueryResult = {
            ...mockQueryResult,
            data: [
                {
                    title: "Gênero",
                    rows: [{ label: "Feminino", value: 34 }],
                },
                {
                    title: "Raça",
                    rows: [{ label: "Branca", value: 20 }],
                },
            ],
        };
        render(<PerfilResponsaveisUpsCard systemName="Rolê Agroecológico" />);

        expect(screen.getByText("Gênero")).toBeInTheDocument();
        expect(screen.getByText("Feminino")).toBeInTheDocument();
        expect(screen.getByText("Raça")).toBeInTheDocument();
        expect(screen.getByText("Branca")).toBeInTheDocument();
    });
});
