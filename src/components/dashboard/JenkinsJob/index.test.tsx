import { withClient } from "@/__mocks__/renderWithClient";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import JenkinsJob from "./index";

function okJson(data: unknown) {
    return {
        ok: true,
        json: async () => data,
    } as unknown as Response;
}

function metricsResponse(number: number, status = "SUCCESS") {
    return okJson({
        found: true,
        data: {
            jobName: "job",
            jobUrl: "https://jenkins.example/job/job",
            status,
            stabilityPercent: 100,
            lastBuild: {
                number,
                status,
                timestampMs: Date.now(),
                timestamp: "01/01/2024 00:00",
                durationMs: 48000,
                duration: "48s",
            },
            lastSuccessfulBuild: {
                number,
                status: "SUCCESS",
                timestampMs: Date.now(),
                timestamp: "01/01/2024 00:00",
                durationMs: 48000,
                duration: "48s",
            },
        },
    });
}

function fetchUrl(input: RequestInfo | URL): string {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.toString();
    return input.url;
}

describe("<JenkinsJob />", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("com múltiplos subprojetos: mostra select de projeto e atualiza automaticamente ao trocar", async () => {
        const fetchSpy = vi
            .spyOn(global, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (
                    url.startsWith("/api/jenkins/metrics?project=PTRF-BackEnd")
                ) {
                    return metricsResponse(1);
                }

                if (
                    url.startsWith("/api/jenkins/metrics?project=PTRF-FrontEnd")
                ) {
                    return metricsResponse(2, "FAILURE");
                }

                throw new Error(`fetch inesperado: ${url}`);
            });

        render(
            withClient(
                <JenkinsJob
                    project="SigEscola"
                    subprojects={[
                        { label: "Backend", key: "PTRF-BackEnd" },
                        { label: "Frontend", key: "PTRF-FrontEnd" },
                    ]}
                />,
            ),
        );

        expect(await screen.findByText("Projeto")).toBeInTheDocument();
        expect(
            screen.queryByLabelText("Selecionar ambiente"),
        ).not.toBeInTheDocument();

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/jenkins/metrics?project=PTRF-BackEnd",
                expect.any(Object),
            );
        });

        const trigger = screen.getByLabelText("Selecionar projeto");
        fireEvent.click(trigger);
        fireEvent.click(screen.getByText("Frontend"));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/jenkins/metrics?project=PTRF-FrontEnd",
                expect.any(Object),
            );
        });
    });

    it("respeita o ambiente recebido via prop (homologacao → env=homolog)", async () => {
        const fetchSpy = vi
            .spyOn(global, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (
                    url.startsWith(
                        "/api/jenkins/metrics?project=PTRF-BackEnd&env=homolog",
                    )
                ) {
                    return metricsResponse(1);
                }

                throw new Error(`fetch inesperado: ${url}`);
            });

        render(
            withClient(
                <JenkinsJob
                    project="SigEscola"
                    environment="homologacao"
                    subprojects={[{ label: "Backend", key: "PTRF-BackEnd" }]}
                />,
            ),
        );

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/jenkins/metrics?project=PTRF-BackEnd&env=homolog",
                expect.any(Object),
            );
        });
    });

    it("respeita o ambiente recebido via prop (qa → env=test)", async () => {
        const fetchSpy = vi
            .spyOn(global, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (
                    url.startsWith(
                        "/api/jenkins/metrics?project=PTRF-BackEnd&env=test",
                    )
                ) {
                    return metricsResponse(1);
                }

                throw new Error(`fetch inesperado: ${url}`);
            });

        render(
            withClient(
                <JenkinsJob
                    project="SigEscola"
                    environment="qa"
                    subprojects={[{ label: "Backend", key: "PTRF-BackEnd" }]}
                />,
            ),
        );

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/jenkins/metrics?project=PTRF-BackEnd&env=test",
                expect.any(Object),
            );
        });
    });

    it("com apenas 1 subprojeto: não exige seleção adicional", async () => {
        const fetchSpy = vi
            .spyOn(global, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (
                    url.startsWith("/api/jenkins/metrics?project=SME-NovoSGP")
                ) {
                    return metricsResponse(1);
                }

                throw new Error(`fetch inesperado: ${url}`);
            });

        render(
            withClient(
                <JenkinsJob
                    project="Novo SGP"
                    subprojects={[{ label: "SME-NovoSGP", key: "SME-NovoSGP" }]}
                />,
            ),
        );

        expect(screen.queryByText("Projeto")).not.toBeInTheDocument();
        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/jenkins/metrics?project=SME-NovoSGP",
                expect.any(Object),
            );
        });
    });

    it("projeto N/E (ou sem chaves): não busca releases e mostra mensagem", async () => {
        const fetchSpy = vi
            .spyOn(global, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (url.startsWith("/api/jenkins/metrics?")) {
                    throw new Error("Não deveria chamar endpoint de job");
                }

                throw new Error(`fetch inesperado: ${url}`);
            });

        render(
            withClient(
                <JenkinsJob project="Portal Educação" subprojects={[]} />,
            ),
        );

        expect(
            await screen.findByText(
                "Sem lançamentos disponíveis para este projeto.",
            ),
        ).toBeInTheDocument();

        expect(fetchSpy).not.toHaveBeenCalled();
    });
});
