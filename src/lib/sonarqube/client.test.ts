import { beforeEach, describe, expect, it, vi } from "vitest";

let getMock: ReturnType<typeof vi.fn> | undefined;
let createMock: ReturnType<typeof vi.fn> | undefined;

vi.mock("axios", () => {
    getMock = vi.fn();
    createMock = vi.fn(() => ({ get: getMock }));
    return {
        default: {
            create: createMock,
        },
    };
});

describe("sonarqube client", () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.SONAR_URL = "https://sonar.example/";
        process.env.SONAR_TOKEN = "token-123";
        getMock?.mockReset();
        createMock?.mockClear();
    });

    it("cria cliente com baseURL sem trailing slash e header de auth", async () => {
        const mod = await import("./client");
        mod.sonarClient();

        expect(createMock).toHaveBeenCalledTimes(1);
        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        expect(config.baseURL).toBe("https://sonar.example");
        const headers = config.headers as Record<string, string>;
        expect(headers.Authorization).toBe("Bearer token-123");
        expect(headers.Accept).toBe("application/json");
    });

    it("reutiliza cliente em chamadas seguintes (cache)", async () => {
        const mod = await import("./client");
        mod.sonarClient();
        mod.sonarClient();
        expect(createMock).toHaveBeenCalledTimes(1);
    });

    it("lança quando SONAR_URL não está configurada", async () => {
        delete process.env.SONAR_URL;
        const mod = await import("./client");
        mod.resetSonarClientCache();
        expect(() => mod.sonarClient()).toThrow(/SONAR_URL/);
    });

    it("lança quando SONAR_TOKEN não está configurada", async () => {
        delete process.env.SONAR_TOKEN;
        const mod = await import("./client");
        mod.resetSonarClientCache();
        expect(() => mod.sonarClient()).toThrow(/SONAR_TOKEN/);
    });

    it("fetchProjectStatus chama endpoint correto com projectKey", async () => {
        const mod = await import("./client");
        getMock!.mockResolvedValueOnce({
            data: { projectStatus: { status: "OK", conditions: [] } },
        });

        const res = await mod.fetchProjectStatus("my-project");

        expect(getMock).toHaveBeenCalledWith(
            "/api/qualitygates/project_status",
            {
                params: { projectKey: "my-project" },
            },
        );
        expect(res.projectStatus.status).toBe("OK");
    });

    it("fetchProjectStatus envia branch quando informada", async () => {
        const mod = await import("./client");
        getMock!.mockResolvedValueOnce({
            data: { projectStatus: { status: "OK", conditions: [] } },
        });

        await mod.fetchProjectStatus("k", "master");
        expect(getMock).toHaveBeenCalledWith(
            "/api/qualitygates/project_status",
            {
                params: { projectKey: "k", branch: "master" },
            },
        );
    });

    it("fetchProjectStatus lança SonarBranchNotFoundError em 404 com branch", async () => {
        const mod = await import("./client");
        getMock!.mockRejectedValueOnce({ response: { status: 404 } });

        await expect(
            mod.fetchProjectStatus("k", "main"),
        ).rejects.toBeInstanceOf(mod.SonarBranchNotFoundError);
    });

    it("fetchProjectStatus propaga erro não-404", async () => {
        const mod = await import("./client");
        getMock!.mockRejectedValueOnce({ response: { status: 500 } });
        await expect(
            mod.fetchProjectStatus("k", "main"),
        ).rejects.not.toBeInstanceOf(mod.SonarBranchNotFoundError);
    });

    it("fetchMeasures envia metricKeys concatenadas por vírgula", async () => {
        const mod = await import("./client");
        getMock!.mockResolvedValueOnce({
            data: { component: { key: "k", name: "n", measures: [] } },
        });

        await mod.fetchMeasures("k", ["bugs", "coverage"]);

        expect(getMock).toHaveBeenCalledWith("/api/measures/component", {
            params: { component: "k", metricKeys: "bugs,coverage" },
        });
    });

    it("fetchMeasures inclui branch e lança SonarBranchNotFoundError em 404", async () => {
        const mod = await import("./client");
        getMock!.mockResolvedValueOnce({
            data: { component: { key: "k", name: "n", measures: [] } },
        });

        await mod.fetchMeasures("k", ["bugs"], "test");
        expect(getMock).toHaveBeenCalledWith("/api/measures/component", {
            params: { component: "k", metricKeys: "bugs", branch: "test" },
        });

        getMock!.mockRejectedValueOnce({ response: { status: 404 } });
        await expect(
            mod.fetchMeasures("k", ["bugs"], "main"),
        ).rejects.toBeInstanceOf(mod.SonarBranchNotFoundError);
    });

    it("fetchMeasures propaga erro quando não há branch", async () => {
        const mod = await import("./client");
        const networkError = new Error("network failure");
        getMock!.mockRejectedValueOnce(networkError);
        await expect(mod.fetchMeasures("k", ["bugs"])).rejects.toThrow(
            "network failure",
        );
    });

    it("searchComponents filtra por qualifier TRK e usa parâmetro 'q'", async () => {
        const mod = await import("./client");
        getMock!.mockResolvedValueOnce({
            data: {
                paging: { pageIndex: 1, pageSize: 20, total: 1 },
                components: [
                    {
                        key: "SME-SIGPAE-FrontEnd",
                        name: "SME-SIGPAE-FrontEnd",
                        qualifier: "TRK",
                    },
                ],
            },
        });

        const res = await mod.searchComponents("SIGPAE");

        expect(getMock).toHaveBeenCalledWith("/api/components/search", {
            params: { qualifiers: "TRK", q: "SIGPAE", ps: 20 },
        });
        expect(res.components).toHaveLength(1);
        expect(res.components[0].key).toBe("SME-SIGPAE-FrontEnd");
    });

    it("searchComponents aceita pageSize customizado", async () => {
        const mod = await import("./client");
        getMock!.mockResolvedValueOnce({
            data: {
                paging: { pageIndex: 1, pageSize: 5, total: 0 },
                components: [],
            },
        });

        await mod.searchComponents("X", 5);
        expect(getMock).toHaveBeenCalledWith("/api/components/search", {
            params: { qualifiers: "TRK", q: "X", ps: 5 },
        });
    });
});
