import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseQueryResult } from "@tanstack/react-query";
import type { BacklogResponse } from "@/types/backlog";
import BacklogCard from "./BacklogCard";

vi.mock("@/components/ui/skeleton", () => ({
    Skeleton: (props: React.HTMLAttributes<HTMLDivElement>) => (
        <div data-testid="skeleton" {...props} />
    ),
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
        <button data-testid="retry-button" {...rest}>
            {children}
        </button>
    ),
}));

type LiteQuery = {
    data?: Partial<BacklogResponse>;
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    refetch?: () => void;
};

const asQuery = (partial: LiteQuery) =>
    partial as unknown as UseQueryResult<BacklogResponse, unknown>;

const makeQuery = (overrides: LiteQuery = {}) =>
    asQuery({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
        ...overrides,
    });

describe("<BacklogCard /> - Bugs", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("mostra o hint quando projectName está ausente", () => {
        render(
            <BacklogCard
                title="Bugs"
                query={makeQuery()}
                emptyProjectHint="Selecione um projeto por favor"
            />
        );

        expect(screen.getByText("Bugs")).toBeInTheDocument();
        expect(screen.getByText("Selecione um projeto por favor")).toBeInTheDocument();
    });

    it("renderiza estado de loading", () => {
        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                query={makeQuery({ isLoading: true })}
            />
        );

        expect(screen.getByText("Bugs")).toBeInTheDocument();
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
    });

    it("renderiza erro e chama refetch ao clicar", async () => {
        const refetch = vi.fn();
        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                query={makeQuery({ isError: true, refetch })}
            />
        );

        expect(screen.getByText("Não foi possível carregar os dados.")).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("retry-button"));
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("mostra mensagem quando não há itens", () => {
        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                query={makeQuery({
                    data: {
                        total_items: 0,
                        parents: [],
                        children: [],
                        metadata: {},
                    },
                })}
            />
        );

        expect(screen.getByText("Bugs")).toBeInTheDocument();
        expect(screen.getByText("Nenhum item encontrado para este projeto.")).toBeInTheDocument();
    });

    it("exibe tabela com itens corretamente", () => {
        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                query={makeQuery({
                    data: {
                        total_items: 2,
                        parents: [],
                        children: [
                            {
                                id: 234232,
                                title: "[SGP] Indisponibilidade do Login",
                                work_item_type: "Bug",
                                state: "New",
                            },
                            {
                                id: 127650,
                                title: "[SGP] Erro no cadastro",
                                work_item_type: "Task",
                                state: "Resolved",
                            },
                        ],
                        metadata: {},
                    },
                })}
            />
        );

        expect(screen.getByText("Bugs")).toBeInTheDocument();
        expect(screen.getByText("Código")).toBeInTheDocument();
        expect(screen.getByText("Título")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Classificação")).toBeInTheDocument();

        expect(screen.getByText("234232")).toBeInTheDocument();
        expect(screen.getByText("[SGP] Indisponibilidade do Login")).toBeInTheDocument();
        expect(screen.getByText("Aberto")).toBeInTheDocument();
        expect(screen.getByText("Bug")).toBeInTheDocument();

        expect(screen.getByText("127650")).toBeInTheDocument();
        expect(screen.getByText("[SGP] Erro no cadastro")).toBeInTheDocument();
        expect(screen.getByText("Resolvido")).toBeInTheDocument();
        expect(screen.getByText("Tarefa")).toBeInTheDocument();
    });

    it("exibe status 'Em andamento' corretamente", () => {
        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                query={makeQuery({
                    data: {
                        total_items: 1,
                        parents: [],
                        children: [
                            {
                                id: 134534,
                                title: "Bug em andamento",
                                work_item_type: "Bug",
                                state: "Active",
                                tags: "Hotfix",
                            },
                        ],
                        metadata: {},
                    },
                })}
            />
        );

        expect(screen.getByText("Em andamento")).toBeInTheDocument();
    });

    it("exibe botão 'Exibir mais' e incrementa itens ao clicar", async () => {
        const items = Array.from({ length: 25 }, (_, i) => ({
            id: 1000 + i,
            title: `Bug ${i + 1}`,
            work_item_type: "Bug",
            state: "New",
        }));

        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                initialVisibleCount={10}
                query={makeQuery({
                    data: {
                        total_items: 25,
                        parents: [],
                        children: items,
                        metadata: {},
                    },
                })}
            />
        );

        expect(screen.getByText("Exibir mais")).toBeInTheDocument();
        expect(screen.getByText("Bug 10")).toBeInTheDocument();
        expect(screen.queryByText("Bug 11")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Exibir mais"));

        expect(screen.getByText("Bug 11")).toBeInTheDocument();
        expect(screen.getByText("Bug 20")).toBeInTheDocument();
        expect(screen.queryByText("Bug 21")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Exibir mais"));

        expect(screen.getByText("Bug 21")).toBeInTheDocument();
        expect(screen.getByText("Bug 25")).toBeInTheDocument();
        expect(screen.queryByText("Exibir mais")).not.toBeInTheDocument();
    });

    it("exibe work_item_type traduzido na coluna Classificação", () => {
        render(
            <BacklogCard
                title="Bugs"
                projectName="Projeto X"
                query={makeQuery({
                    data: {
                        total_items: 2,
                        parents: [],
                        children: [
                            {
                                id: 125462,
                                title: "Bug de teste",
                                work_item_type: "Bug",
                                state: "Resolved",
                            },
                            {
                                id: 125463,
                                title: "Task de teste",
                                work_item_type: "Task",
                                state: "Active",
                            },
                        ],
                        metadata: {},
                    },
                })}
            />
        );

        expect(screen.getByText("Bug")).toBeInTheDocument();
        expect(screen.getByText("Tarefa")).toBeInTheDocument();
    });
});
