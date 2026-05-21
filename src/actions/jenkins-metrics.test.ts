import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchJenkinsJobMock = vi.fn();

vi.mock("@/lib/jenkins.server", () => ({
    fetchJenkinsJob: fetchJenkinsJobMock,
    isJenkinsNotFound: (error: unknown) =>
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 404,
}));

describe("jenkins metrics action", () => {
    beforeEach(() => {
        vi.resetModules();
        fetchJenkinsJobMock.mockReset();
    });

    it("busca master quando o projeto vem sem branch", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "master",
            url: "https://jenkins.example/job/SME/job/master/",
            healthReport: [{ score: 80, description: "ok" }],
            lastBuild: {
                number: 10,
                result: "SUCCESS",
                duration: 48000,
                timestamp: 1711814400000,
            },
            lastSuccessfulBuild: {
                number: 10,
                result: "SUCCESS",
                duration: 48000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

        expect(fetchJenkinsJobMock).toHaveBeenCalledWith("SME-NovoSGP/master");
        expect(result.found).toBe(true);
        if (result.found) {
            expect(result.data.stabilityPercent).toBe(80);
            expect(result.data.status).toBe("SUCCESS");
            expect(result.data.lastBuild?.number).toBe(10);
        }
    });

    it("cai no job no root quando candidatos /master e /main retornam 404", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock
            .mockRejectedValueOnce({ response: { status: 404 } })
            .mockRejectedValueOnce({ response: { status: 404 } })
            .mockResolvedValueOnce({
                name: "ROLE-AGROECOLOGICO",
                url: "https://jenkins.example/job/ROLE-AGROECOLOGICO/",
                healthReport: [{ score: 90 }],
                lastBuild: {
                    number: 5,
                    result: "SUCCESS",
                    duration: 1000,
                    timestamp: 1711814400000,
                },
            });

        const result = await getJenkinsBranchBuildMetrics("ROLE-AGROECOLOGICO");

        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            1,
            "ROLE-AGROECOLOGICO/master",
        );
        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            2,
            "ROLE-AGROECOLOGICO/main",
        );
        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            3,
            "ROLE-AGROECOLOGICO",
        );
        expect(result.found).toBe(true);
    });

    it("tenta branches de homologação quando ambiente é homolog", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock
            .mockRejectedValueOnce({ response: { status: 404 } })
            .mockResolvedValueOnce({
                name: "hml",
                builds: [
                    {
                        number: 2,
                        result: "SUCCESS",
                        duration: 1000,
                        timestamp: 1711814400000,
                    },
                    {
                        number: 1,
                        result: "FAILURE",
                        duration: 1000,
                        timestamp: 1711814300000,
                    },
                ],
                lastBuild: {
                    number: 2,
                    result: "SUCCESS",
                    duration: 1000,
                    timestamp: 1711814400000,
                },
            });

        const result = await getJenkinsBranchBuildMetrics(
            "SME-NovoSGP",
            "homolog",
        );

        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            1,
            "SME-NovoSGP/homolog",
        );
        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            2,
            "SME-NovoSGP/homologacao",
        );
        expect(result.found).toBe(true);
        if (result.found) expect(result.data.stabilityPercent).toBe(50);
    });

    it("retorna not found quando todos candidatos dão 404", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockRejectedValue({ response: { status: 404 } });

        const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

        expect(result).toEqual({
            found: false,
            message:
                "Job não encontrado no Jenkins (tentado: SME-NovoSGP/master, SME-NovoSGP/main, SME-NovoSGP)",
        });
    });

    it("usa currentEnv com prod para derivar candidatos de homologação", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "homolog",
            url: "https://jenkins.example/job/SME-NovoSGP/job/homolog/",
            lastBuild: {
                number: 1,
                result: "SUCCESS",
                duration: 1000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics(
            "SME-NovoSGP/prod",
            "homolog",
        );

        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            1,
            "SME-NovoSGP/homolog",
        );
        expect(result.found).toBe(true);
    });

    it("tenta branches de teste quando ambiente é test sem barra no projeto", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock
            .mockRejectedValueOnce({ response: { status: 404 } })
            .mockResolvedValueOnce({
                name: "teste",
                url: "https://jenkins.example/job/SME-NovoSGP/job/teste/",
                lastBuild: {
                    number: 1,
                    result: "SUCCESS",
                    duration: 1000,
                    timestamp: 1711814400000,
                },
            });

        const result = await getJenkinsBranchBuildMetrics(
            "SME-NovoSGP",
            "test",
        );

        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            1,
            "SME-NovoSGP/test",
        );
        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            2,
            "SME-NovoSGP/teste",
        );
        expect(result.found).toBe(true);
    });

    it("usa currentEnv com prod para derivar candidato de test substituído", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "test",
            url: "https://jenkins.example/job/SME-NovoSGP/job/test/",
            lastBuild: {
                number: 1,
                result: "SUCCESS",
                duration: 1000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics(
            "SME-NovoSGP/prod",
            "test",
        );

        expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(
            1,
            "SME-NovoSGP/test",
        );
        expect(result.found).toBe(true);
    });

    it("normaliza status como UNKNOWN quando result do build não é reconhecido", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "master",
            url: "https://jenkins.example/job/SME-NovoSGP/job/master/",
            lastBuild: {
                number: 1,
                result: null,
                duration: 1000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

        expect(result.found).toBe(true);
        if (result.found) expect(result.data.status).toBe("UNKNOWN");
    });

    it("propaga erro que não é 404 do Jenkins", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        const networkError = new Error("Connection refused");
        fetchJenkinsJobMock.mockRejectedValueOnce(networkError);

        await expect(
            getJenkinsBranchBuildMetrics("SME-NovoSGP"),
        ).rejects.toThrow("Connection refused");
    });

    it("retorna candidato com barra quando environment cai no fallback", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "v2",
            url: "https://jenkins.example/job/SME-NovoSGP/job/v2/",
            lastBuild: {
                number: 1,
                result: "SUCCESS",
                duration: 1000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics(
            "SME-NovoSGP/v2",
            "staging",
        );

        expect(fetchJenkinsJobMock).toHaveBeenCalledWith("SME-NovoSGP/v2");
        expect(result.found).toBe(true);
    });

    it("omite lastBuild quando nulo e mapeia lastFailedBuild quando presente", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "master",
            url: "https://jenkins.example/job/SME-NovoSGP/job/master/",
            lastBuild: null,
            lastFailedBuild: {
                number: 3,
                result: "FAILURE",
                duration: 2000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

        expect(result.found).toBe(true);
        if (result.found) {
            expect(result.data.lastBuild).toBeUndefined();
            expect(result.data.lastFailedBuild?.number).toBe(3);
        }
    });

    it("retorna erro quando projeto é vazio", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");

        const result = await getJenkinsBranchBuildMetrics("   ");

        expect(result).toEqual({
            found: false,
            message: "Projeto Jenkins não informado",
        });
        expect(fetchJenkinsJobMock).not.toHaveBeenCalled();
    });

    it("retorna projeto com barra diretamente quando environment é prod e usa fallback de nome", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            url: "https://jenkins.example/job/SME-NovoSGP/job/master/",
            lastBuild: {
                number: 1,
                result: "SUCCESS",
                duration: 1000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics(
            "SME-NovoSGP/master",
            "prod",
        );

        expect(fetchJenkinsJobMock).toHaveBeenCalledWith("SME-NovoSGP/master");
        expect(result.found).toBe(true);
        if (result.found)
            expect(result.data.jobName).toBe("SME-NovoSGP/master");
    });

    it("normaliza status como IN_PROGRESS quando build está em execução ", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "master",
            url: "https://jenkins.example/job/SME-NovoSGP/job/master/",
            lastBuild: {
                number: 1,
                building: true,
                result: null,
                duration: 1000,
                timestamp: 1711814400000,
            },
        });

        const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

        expect(result.found).toBe(true);
        if (result.found) expect(result.data.status).toBe("IN_PROGRESS");
    });

    it("parseBuild retorna undefined para builds com dados numéricos inválidos", async () => {
        const { getJenkinsBranchBuildMetrics } =
            await import("./jenkins-metrics");
        fetchJenkinsJobMock.mockResolvedValueOnce({
            name: "master",
            url: "https://jenkins.example/job/SME-NovoSGP/job/master/",
            lastBuild: {
                number: undefined,
                timestamp: 1711814400000,
                duration: 1000,
                result: "SUCCESS",
            },
            lastSuccessfulBuild: {
                number: 5,
                timestamp: undefined,
                duration: 1000,
                result: "SUCCESS",
            },
            lastFailedBuild: {
                number: 5,
                timestamp: 1711814400000,
                duration: undefined,
                result: "FAILURE",
            },
        });

        const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

        expect(result.found).toBe(true);
        if (result.found) {
            expect(result.data.lastBuild).toBeUndefined();
            expect(result.data.lastSuccessfulBuild).toBeUndefined();
            expect(result.data.lastFailedBuild).toBeUndefined();
        }
    });
});
