import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

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
    data?: ActiveAccessUsersResponse;
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

vi.mock("@/hooks/useActiveAccessUsers", () => ({
    useActiveAccessUsers: () => mockQueryResult,
}));

import UsersWithAccessCard from "./UsersWithAccessCard";

describe("<UsersWithAccessCard />", () => {
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
        render(<UsersWithAccessCard />);
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("loading mostra skeletons", () => {
        mockQueryResult = { ...mockQueryResult, isLoading: true };
        render(<UsersWithAccessCard systemName="SigPAE" />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
    });

    it("erro mostra mensagem e botão de retry", async () => {
        const refetch = vi.fn();
        mockQueryResult = { ...mockQueryResult, isError: true, refetch };
        render(<UsersWithAccessCard systemName="SigPAE" />);

        expect(
            screen.getByText("Não foi possível carregar os usuários com acesso."),
        ).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("retry-button"));
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("formata valor em pt-BR e não mostra link de visualização", () => {
        mockQueryResult = {
            ...mockQueryResult,
            data: {
                activeCount: 8398,
                trend: "above",
                trendLabel: "453 novos nos últimos 30 dias",
            },
        };
        render(<UsersWithAccessCard systemName="SigPAE" />);

        expect(screen.getByText("8.398")).toBeInTheDocument();
        expect(
            screen.getByText("usuários cadastrados com acesso ativo"),
        ).toBeInTheDocument();
        expect(screen.queryByText("Visualizar dados")).not.toBeInTheDocument();
    });
});
