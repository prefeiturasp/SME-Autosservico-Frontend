import type { UseQueryResult } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { JenkinsJobSummary } from "@/types/jenkins";
import JenkinsJobCard from "./JenkinsJobCard";

vi.mock("@/components/ui/skeleton", () => {
    function Skeleton(props: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
        return <div data-testid="skeleton" {...props} />;
    }

    return { Skeleton };
});

vi.mock("@/components/ui/button", () => {
    const Button = React.forwardRef<
        HTMLButtonElement,
        React.ButtonHTMLAttributes<HTMLButtonElement>
    >(function Button({ children, ...rest }, ref) {
        return (
            <button ref={ref} {...rest}>
                {children}
            </button>
        );
    });
    Button.displayName = "Button";

    return { Button };
});

vi.mock("@/components/ui/select", () => {
    type SelectProps = {
        readonly children: React.ReactNode;
        readonly value?: string;
        readonly onValueChange?: (v: string) => void;
    };
    const Select = ({ children, onValueChange }: SelectProps) => (
        <div>
            {children}
            <button
                type="button"
                data-testid="env-select-homolog"
                onClick={() => onValueChange?.("homolog")}
            >
                homolog
            </button>
            <button
                type="button"
                data-testid="env-select-outro"
                onClick={() => onValueChange?.("outro")}
            >
                outro
            </button>
        </div>
    );
    const SelectTrigger = ({
        children,
    }: {
        readonly children: React.ReactNode;
    }) => <div>{children}</div>;
    const SelectValue = ({
        placeholder,
    }: {
        readonly placeholder?: string;
    }) => <span>{placeholder}</span>;
    const SelectContent = ({
        children,
    }: {
        readonly children: React.ReactNode;
    }) => <div>{children}</div>;
    const SelectItem = ({
        children,
        value,
    }: {
        readonly children: React.ReactNode;
        readonly value: string;
    }) => <div data-value={value}>{children}</div>;
    return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
});

type LiteQuery = {
    data?: JenkinsJobSummary;
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    refetch?: () => void;
};

const asQuery = (partial: LiteQuery) =>
    partial as unknown as UseQueryResult<JenkinsJobSummary, unknown>;

const makeQuery = (overrides: LiteQuery = {}) =>
    asQuery({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
        ...overrides,
    });

describe("<JenkinsJobCard />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("mostra o hint quando projectName está ausente", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                className="bg-muted p-3"
                query={makeQuery()}
                emptyProjectHint="Selecione um projeto por favor"
            />,
        );

        expect(screen.getByText("Lançamentos")).toBeInTheDocument();
        expect(
            screen.getByText("Selecione um projeto por favor"),
        ).toBeInTheDocument();
    });

    it("renderiza estado de loading", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                projectName="SME-NovoSGP-Docs/master"
                query={makeQuery({ isLoading: true })}
            />,
        );

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            1,
        );
    });

    it("renderiza erro e chama refetch ao clicar em 'Tentar novamente'", async () => {
        const refetch = vi.fn();
        render(
            <JenkinsJobCard
                title="Lançamentos"
                projectName="SME-NovoSGP-Docs/master"
                query={makeQuery({ isError: true, refetch })}
            />,
        );

        expect(
            screen.getByText("Não foi possível carregar os dados."),
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: /Tentar novamente/i }),
        );
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("sucesso sem builds -> mostra mensagem de ausência de dados", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                projectName="SME-NovoSGP-Docs/master"
                query={makeQuery({ data: {} })}
            />,
        );

        expect(
            screen.getByText("Sem dados de versão para este projeto."),
        ).toBeInTheDocument();
    });

    it("sucesso -> exibe versão realizada com ícone de relógio", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                projectName="SME-NovoSGP-Docs/master"
                query={makeQuery({
                    data: {
                        lastSuccessfulBuild: {
                            number: 11,
                            status: "SUCCESS",
                            timestampMs: 1706266134892,
                            timestamp: "26/01/2024 10:22",
                            durationMs: 88873,
                            duration: "1m 28s",
                        },
                    },
                })}
            />,
        );

        expect(screen.getByText("v11")).toBeInTheDocument();
        expect(
            screen.getByText(/Realizado em: 26\/01\/2024 10:22/),
        ).toBeInTheDocument();
    });

    it("exibe versão agendada quando lastBuild é diferente de lastSuccessfulBuild", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                projectName="SME-NovoSGP-Docs/master"
                query={makeQuery({
                    data: {
                        lastBuild: {
                            number: 12,
                            status: "IN_PROGRESS",
                            timestampMs: 1706352534892,
                            timestamp: "27/01/2024 10:22",
                            durationMs: 0,
                            duration: "0s",
                        },
                        lastSuccessfulBuild: {
                            number: 11,
                            status: "SUCCESS",
                            timestampMs: 1706266134892,
                            timestamp: "26/01/2024 10:22",
                            durationMs: 88873,
                            duration: "1m 28s",
                        },
                    },
                })}
            />,
        );

        expect(screen.getByText("v11")).toBeInTheDocument();
        expect(
            screen.getByText(/Realizado em: 26\/01\/2024 10:22/),
        ).toBeInTheDocument();
        expect(screen.getByText("v12")).toBeInTheDocument();
        expect(
            screen.getByText(/Agendado para: 27\/01\/2024 10:22/),
        ).toBeInTheDocument();
    });

    it("não exibe versão agendada quando lastBuild é igual a lastSuccessfulBuild", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                projectName="SME-NovoSGP-Docs/master"
                query={makeQuery({
                    data: {
                        lastBuild: {
                            number: 11,
                            status: "SUCCESS",
                            timestampMs: 1706266134892,
                            timestamp: "26/01/2024 10:22",
                            durationMs: 88873,
                            duration: "1m 28s",
                        },
                        lastSuccessfulBuild: {
                            number: 11,
                            status: "SUCCESS",
                            timestampMs: 1706266134892,
                            timestamp: "26/01/2024 10:22",
                            durationMs: 88873,
                            duration: "1m 28s",
                        },
                    },
                })}
            />,
        );

        expect(screen.getByText("v11")).toBeInTheDocument();
        expect(screen.getByText(/Realizado em:/)).toBeInTheDocument();
        expect(screen.queryByText(/Agendado para:/)).not.toBeInTheDocument();
    });

    it("renderiza seletor de ambiente quando showEnvironmentSelect e onEnvironmentChange são fornecidos", () => {
        const onEnvironmentChange = vi.fn();
        render(
            <JenkinsJobCard
                title="Lançamentos"
                query={makeQuery()}
                showEnvironmentSelect
                environment="prod"
                onEnvironmentChange={onEnvironmentChange}
            />,
        );

        expect(screen.getByText("Ambiente")).toBeInTheDocument();
    });

    it("chama onEnvironmentChange com 'homolog' ao selecionar homologação", async () => {
        const onEnvironmentChange = vi.fn();
        render(
            <JenkinsJobCard
                title="Lançamentos"
                query={makeQuery()}
                showEnvironmentSelect
                environment="prod"
                onEnvironmentChange={onEnvironmentChange}
            />,
        );

        await userEvent.click(screen.getByTestId("env-select-homolog"));
        expect(onEnvironmentChange).toHaveBeenCalledWith("homolog");
    });

    it("chama onEnvironmentChange com 'prod' ao selecionar valor não-homolog", async () => {
        const onEnvironmentChange = vi.fn();
        render(
            <JenkinsJobCard
                title="Lançamentos"
                query={makeQuery()}
                showEnvironmentSelect
                environment="homolog"
                onEnvironmentChange={onEnvironmentChange}
            />,
        );

        await userEvent.click(screen.getByTestId("env-select-outro"));
        expect(onEnvironmentChange).toHaveBeenCalledWith("prod");
    });

    it("renderiza sem card wrapper quando contentOnly é true", () => {
        render(
            <JenkinsJobCard
                title="Lançamentos"
                query={makeQuery()}
                contentOnly
            />,
        );

        expect(screen.getByText("Lançamentos")).toBeInTheDocument();
    });

    it("Header retorna null quando contentOnly é true e title está vazio", () => {
        render(<JenkinsJobCard title="" query={makeQuery()} contentOnly />);

        expect(screen.queryByText("Lançamentos")).not.toBeInTheDocument();
    });
});
