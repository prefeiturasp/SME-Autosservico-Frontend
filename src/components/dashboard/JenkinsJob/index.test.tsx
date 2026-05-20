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

function fetchUrl(input: RequestInfo | URL): string {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.toString();
    return input.url;
}

describe("<JenkinsJob />", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("com múltiplos subprojetos: mostra select e atualiza automaticamente ao trocar", async () => {
        const fetchSpy = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (
                    url.startsWith(
                        "/api/zabbix/jenkins/job?project=PTRF-FrontEnd&env=homolog",
                    )
                ) {
                    return okJson({
                        lastBuild: {
                            number: 99,
                            status: "SUCCESS",
                            timestampMs: 99,
                            timestamp: "03/01/2024 00:00",
                            durationMs: 99000,
                            duration: "99s",
                        },
                    });
                }

                if (
                    url.startsWith(
                        "/api/zabbix/jenkins/job?project=PTRF-BackEnd",
                    )
                ) {
                    return okJson({
                        lastBuild: {
                            number: 1,
                            status: "SUCCESS",
                            timestampMs: 1,
                            timestamp: "01/01/2024 00:00",
                            durationMs: 1000,
                            duration: "1s",
                        },
                    });
                }

                if (
                    url.startsWith(
                        "/api/zabbix/jenkins/job?project=PTRF-FrontEnd",
                    )
                ) {
                    return okJson({
                        lastBuild: {
                            number: 2,
                            status: "FAILURE",
                            timestampMs: 2,
                            timestamp: "02/01/2024 00:00",
                            durationMs: 2000,
                            duration: "2s",
                        },
                    });
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
            await screen.findByLabelText("Selecionar ambiente"),
        ).toHaveTextContent("Produção");

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/zabbix/jenkins/job?project=PTRF-BackEnd",
                expect.any(Object),
            );
        });

        const trigger = screen.getByLabelText("Selecionar projeto");
        fireEvent.click(trigger);
        fireEvent.click(screen.getByText("Frontend"));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/zabbix/jenkins/job?project=PTRF-FrontEnd",
                expect.any(Object),
            );
        });

        const envTrigger = screen.getByLabelText("Selecionar ambiente");
        fireEvent.click(envTrigger);
        fireEvent.click(screen.getByText("Homologação"));

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/zabbix/jenkins/job?project=PTRF-FrontEnd&env=homolog",
                expect.any(Object),
            );
        });

        expect(screen.getByLabelText("Selecionar ambiente")).toHaveTextContent(
            "Homologação",
        );
    });

    it("com apenas 1 subprojeto: não exige seleção adicional", async () => {
        const fetchSpy = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (
                    url.startsWith(
                        "/api/zabbix/jenkins/job?project=SME-NovoSGP",
                    )
                ) {
                    return okJson({
                        lastBuild: {
                            number: 1,
                            status: "SUCCESS",
                            timestampMs: 1,
                            timestamp: "01/01/2024 00:00",
                            durationMs: 1000,
                            duration: "1s",
                        },
                    });
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
        expect(
            await screen.findByLabelText("Selecionar ambiente"),
        ).toHaveTextContent("Produção");

        await waitFor(() => {
            expect(fetchSpy).toHaveBeenCalledWith(
                "/api/zabbix/jenkins/job?project=SME-NovoSGP",
                expect.any(Object),
            );
        });
    });

    it("projeto N/E (ou sem chaves): não busca releases e mostra mensagem", async () => {
        const fetchSpy = vi
            .spyOn(globalThis, "fetch")
            .mockImplementation(async (input) => {
                const url = fetchUrl(input);

                if (url.startsWith("/api/zabbix/jenkins/job?")) {
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

    it("sem project (string vazia): renderiza JenkinsJobCard com projectName vazio", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as unknown as Response);

        render(withClient(<JenkinsJob project="" />));

        expect(
            await screen.findByLabelText("Selecionar ambiente"),
        ).toBeInTheDocument();
    });

    it("mantém subprojeto selecionado quando lista é ampliada e chave atual permanece válida (ramo prev do useEffect)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as unknown as Response);

        const subA = { key: "KEY-A", label: "Projeto A" };
        const subB = { key: "KEY-B", label: "Projeto B" };
        const subC = { key: "KEY-C", label: "Projeto C" };

        const { rerender } = render(
            withClient(<JenkinsJob project="P" subprojects={[subA, subB]} />),
        );

        await waitFor(() => {
            expect(globalThis.fetch).toHaveBeenCalledWith(
                expect.stringContaining("project=KEY-A"),
                expect.any(Object),
            );
        });

        rerender(
            withClient(
                <JenkinsJob project="P" subprojects={[subA, subB, subC]} />,
            ),
        );

        await waitFor(() => {
            expect(
                screen.getByLabelText("Selecionar projeto"),
            ).toBeInTheDocument();
        });
    });

    it("com múltiplos subprojetos: alterna ambiente de homolog de volta para prod (ramo 'prod' do onValueChange)", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as unknown as Response);

        render(
            withClient(
                <JenkinsJob
                    project="P"
                    subprojects={[
                        { key: "KEY-A", label: "A" },
                        { key: "KEY-B", label: "B" },
                    ]}
                />,
            ),
        );

        const envTrigger = await screen.findByLabelText("Selecionar ambiente");

        fireEvent.click(envTrigger);
        fireEvent.click(screen.getByText("Homologação"));
        await waitFor(() =>
            expect(
                screen.getByLabelText("Selecionar ambiente"),
            ).toHaveTextContent("Homologação"),
        );

        fireEvent.click(screen.getByLabelText("Selecionar ambiente"));
        fireEvent.click(screen.getByText("Produção"));
        await waitFor(() =>
            expect(
                screen.getByLabelText("Selecionar ambiente"),
            ).toHaveTextContent("Produção"),
        );
    });
});
