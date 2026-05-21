import type { JenkinsMetricsApiResponse } from "@/types/jenkins-metrics";
import type { UseQueryResult } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import JenkinsBranchBuildsCard from "./JenkinsBranchBuildsCard";

function query(
    partial: Partial<UseQueryResult<JenkinsMetricsApiResponse, unknown>>,
): UseQueryResult<JenkinsMetricsApiResponse, unknown> {
    return {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
        ...partial,
    } as unknown as UseQueryResult<JenkinsMetricsApiResponse, unknown>;
}

describe("<JenkinsBranchBuildsCard />", () => {
    it("renderiza métricas no layout do Figma", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: true,
                        data: {
                            jobName: "master",
                            jobUrl: "https://jenkins.example",
                            status: "SUCCESS",
                            stabilityPercent: 100,
                            lastBuild: {
                                number: 53,
                                status: "SUCCESS",
                                timestampMs: Date.now(),
                                timestamp: "01/01/2024 13:37",
                                durationMs: 48 * 60 * 1000,
                                duration: "48 min",
                            },
                            lastSuccessfulBuild: {
                                number: 53,
                                status: "SUCCESS",
                                timestampMs: Date.now(),
                                timestamp: "01/01/2024 13:37",
                                durationMs: 48 * 60 * 1000,
                                duration: "48 min",
                            },
                            lastFailedBuild: {
                                number: 42,
                                status: "FAILURE",
                                timestampMs: new Date(
                                    2026,
                                    2,
                                    27,
                                    9,
                                    51,
                                ).getTime(),
                                timestamp: "27/03/2026 09:51",
                                durationMs: 1000,
                                duration: "1s",
                            },
                        },
                    },
                })}
            />,
        );

        expect(
            screen.getByText("Jenkins - Branches e Builds"),
        ).toBeInTheDocument();
        expect(screen.getByText("Sucesso")).toBeInTheDocument();
        expect(screen.getByText("Estabilidade")).toBeInTheDocument();
        expect(screen.getByText("100%")).toBeInTheDocument();
        expect(screen.getByText("Último sucesso")).toBeInTheDocument();
        expect(screen.getAllByText("#53")).toHaveLength(2);
        expect(screen.getByText("Última falha")).toBeInTheDocument();
        expect(screen.getByText("#42")).toBeInTheDocument();
        expect(screen.getByText("Build atual")).toBeInTheDocument();
        expect(screen.getByText("48 min")).toBeInTheDocument();
        expect(screen.getByText("concluído")).toBeInTheDocument();
    });

    it("exibe label Falha quando status é FAILURE (linhas 44, 61)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: true,
                        data: {
                            jobName: "master",
                            jobUrl: "https://jenkins.example",
                            status: "FAILURE",
                            stabilityPercent: 40,
                        },
                    },
                })}
            />,
        );
        expect(screen.getByText("Falha")).toBeInTheDocument();
    });

    it("exibe label Em andamento e estado 'em andamento' quando build está em progresso (linhas 46, 63, 101)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: true,
                        data: {
                            jobName: "master",
                            jobUrl: "https://jenkins.example",
                            status: "IN_PROGRESS",
                            stabilityPercent: 75,
                            lastBuild: {
                                number: 54,
                                status: "IN_PROGRESS",
                                timestampMs: Date.now(),
                                timestamp: "20/05/2026 10:00",
                                durationMs: 60000,
                                duration: "1 min",
                            },
                        },
                    },
                })}
            />,
        );
        expect(screen.getByText("Em andamento")).toBeInTheDocument();
        expect(screen.getByText("em andamento")).toBeInTheDocument();
    });

    it("exibe label Instável quando status é UNSTABLE (linhas 48, 65)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: true,
                        data: {
                            jobName: "master",
                            jobUrl: "https://jenkins.example",
                            status: "UNSTABLE",
                            stabilityPercent: 60,
                        },
                    },
                })}
            />,
        );
        expect(screen.getByText("Instável")).toBeInTheDocument();
    });

    it("exibe label Abortado quando status é ABORTED (linha 50)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: true,
                        data: {
                            jobName: "master",
                            jobUrl: "https://jenkins.example",
                            status: "ABORTED",
                            stabilityPercent: 80,
                        },
                    },
                })}
            />,
        );
        expect(screen.getByText("Abortado")).toBeInTheDocument();
    });

    it("exibe label Desconhecido quando status é UNKNOWN (linha 52)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: true,
                        data: {
                            jobName: "master",
                            jobUrl: "https://jenkins.example",
                            status: "UNKNOWN",
                            stabilityPercent: 0,
                        },
                    },
                })}
            />,
        );
        expect(screen.getByText("Desconhecido")).toBeInTheDocument();
    });

    it("exibe mensagem de erro com botão de retry quando isError é true (linhas 187-197)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({ isError: true })}
            />,
        );
        expect(
            screen.getByText("Não foi possível carregar os dados."),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /tentar novamente/i }),
        ).toBeInTheDocument();
    });

    it("exibe mensagem do servidor quando job não é encontrado (linhas 200-206)", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({
                    data: {
                        found: false,
                        message: "Job não encontrado no Jenkins",
                    },
                })}
            />,
        );
        expect(
            screen.getByText("Job não encontrado no Jenkins"),
        ).toBeInTheDocument();
    });

    it("chama refetch ao clicar em 'Tentar novamente'", () => {
        const refetchMock = vi.fn();
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({ isError: true, refetch: refetchMock })}
            />,
        );
        fireEvent.click(
            screen.getByRole("button", { name: /tentar novamente/i }),
        );
        expect(refetchMock).toHaveBeenCalledTimes(1);
    });

    it("contentOnly=true sem projectName: não renderiza título", () => {
        render(
            <JenkinsBranchBuildsCard
                contentOnly
                query={query({})}
                emptyProjectHint="Escolha um projeto"
            />,
        );
        expect(
            screen.queryByText("Jenkins - Branches e Builds"),
        ).not.toBeInTheDocument();
        expect(screen.getByText("Escolha um projeto")).toBeInTheDocument();
    });

    it("sem projectName e contentOnly=false: renderiza título e hint", () => {
        render(
            <JenkinsBranchBuildsCard
                query={query({})}
                emptyProjectHint="Selecione um projeto"
            />,
        );
        expect(
            screen.getByText("Jenkins - Branches e Builds"),
        ).toBeInTheDocument();
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("contentOnly=true em estado de loading: não renderiza título", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                contentOnly
                query={query({ isLoading: true })}
            />,
        );
        expect(
            screen.queryByText("Jenkins - Branches e Builds"),
        ).not.toBeInTheDocument();
    });

    it("contentOnly=true em estado de erro: não renderiza título", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                contentOnly
                query={query({ isError: true })}
            />,
        );
        expect(
            screen.queryByText("Jenkins - Branches e Builds"),
        ).not.toBeInTheDocument();
        expect(
            screen.getByText("Não foi possível carregar os dados."),
        ).toBeInTheDocument();
    });

    it("exibe skeleton quando isFetching=true e isLoading=false", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({ isLoading: false, isFetching: true })}
            />,
        );
        expect(
            screen.getByText("Jenkins - Branches e Builds"),
        ).toBeInTheDocument();
        // Skeleton é renderizado como elementos DOM sem texto significativo
        expect(screen.queryByText("Sucesso")).not.toBeInTheDocument();
    });

    it("exibe erro quando data é undefined e isError=false", () => {
        render(
            <JenkinsBranchBuildsCard
                projectName="SME-NovoSGP/master"
                query={query({ isError: false, data: undefined })}
            />,
        );
        expect(
            screen.getByText("Não foi possível carregar os dados."),
        ).toBeInTheDocument();
    });
});
