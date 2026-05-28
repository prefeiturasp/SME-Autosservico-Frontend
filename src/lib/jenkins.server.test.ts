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

describe("jenkins client", () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.JENKINS_URL = "https://jenkins.example/";
        process.env.JENKINS_USERNAME = "reader";
        process.env.JENKINS_API_TOKEN = "token-123";
        delete process.env.JENKINS_TIMEOUT_MS;
        getMock?.mockReset();
        createMock?.mockClear();
    });

    it("cria cliente com baseURL sem trailing slash e Basic Auth", async () => {
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();

        expect(createMock).toHaveBeenCalledTimes(1);
        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        expect(config.baseURL).toBe("https://jenkins.example");
        expect(config.timeout).toBe(10000);

        const headers = config.headers as Record<string, string>;
        expect(headers.Authorization).toBe(
            `Basic ${Buffer.from("reader:token-123").toString("base64")}`,
        );
        expect(headers.Accept).toBe("application/json");
    });

    it("converte fullName multibranch para path aninhado do Jenkins", async () => {
        const mod = await import("./jenkins.server");
        expect(mod.jenkinsFullNameToJobPath("SME-NovoSGP/master")).toBe(
            "/job/SME-NovoSGP/job/master",
        );
    });

    it("codifica segmentos do path sem perder a hierarquia", async () => {
        const mod = await import("./jenkins.server");
        expect(mod.jenkinsFullNameToJobPath("Pasta A/feature/teste 1")).toBe(
            "/job/Pasta%20A/job/feature/job/teste%201",
        );
    });

    it("fetchJenkinsJob consulta api/json com tree enxuto", async () => {
        const mod = await import("./jenkins.server");
        getMock!.mockResolvedValueOnce({ data: { name: "master" } });

        const res = await mod.fetchJenkinsJob("SME-NovoSGP/master");

        expect(getMock).toHaveBeenCalledWith(
            "/job/SME-NovoSGP/job/master/api/json",
            {
                params: {
                    tree: expect.stringContaining(
                        "healthReport[score,description]",
                    ),
                },
            },
        );
        expect(res.name).toBe("master");
    });

    it("reutiliza o cliente em cache na segunda chamada", async () => {
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();
        mod.jenkinsClient();

        expect(createMock).toHaveBeenCalledTimes(1);
    });

    it("resetJenkinsClientCache força recriação do cliente na próxima chamada", async () => {
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();
        mod.resetJenkinsClientCache();
        mod.jenkinsClient();

        expect(createMock).toHaveBeenCalledTimes(2);
    });

    it("usa username padrão quando JENKINS_USERNAME não está configurada", async () => {
        delete process.env.JENKINS_USERNAME;
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();

        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        const headers = config.headers as Record<string, string>;
        expect(headers.Authorization).toMatch(/^Basic /);
    });

    it("usa token padrão quando JENKINS_API_TOKEN não está configurada", async () => {
        delete process.env.JENKINS_API_TOKEN;
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();

        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        const headers = config.headers as Record<string, string>;
        expect(headers.Authorization).toMatch(/^Basic /);
    });

    it("usa URL padrão quando JENKINS_URL não está configurada", async () => {
        delete process.env.JENKINS_URL;
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();

        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        expect(config.baseURL).toBe(
            "https://jenkins2.sme.prefeitura.sp.gov.br",
        );
    });

    it("usa JENKINS_TIMEOUT_MS quando configurado com valor válido", async () => {
        process.env.JENKINS_TIMEOUT_MS = "5000";
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();

        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        expect(config.timeout).toBe(5000);
    });

    it("usa timeout padrão quando JENKINS_TIMEOUT_MS é inválido", async () => {
        process.env.JENKINS_TIMEOUT_MS = "abc";
        const mod = await import("./jenkins.server");
        mod.jenkinsClient();

        const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
        expect(config.timeout).toBe(10000);
    });

    it("lança erro para fullName vazio em jenkinsFullNameToJobPath", async () => {
        const mod = await import("./jenkins.server");

        expect(() => mod.jenkinsFullNameToJobPath("")).toThrow(
            "Nome do job Jenkins inválido",
        );
    });

    it("isJenkinsNotFound retorna true para erro 404", async () => {
        const mod = await import("./jenkins.server");

        expect(mod.isJenkinsNotFound({ response: { status: 404 } })).toBe(true);
    });

    it("isJenkinsNotFound retorna false para string", async () => {
        const mod = await import("./jenkins.server");

        expect(mod.isJenkinsNotFound("erro de rede")).toBe(false);
    });

    it("isJenkinsNotFound retorna false para null", async () => {
        const mod = await import("./jenkins.server");

        expect(mod.isJenkinsNotFound(null)).toBe(false);
    });

    it("isJenkinsNotFound retorna false para objeto sem response", async () => {
        const mod = await import("./jenkins.server");

        expect(mod.isJenkinsNotFound({ message: "Network Error" })).toBe(false);
    });

    it("isJenkinsNotFound retorna false para status diferente de 404", async () => {
        const mod = await import("./jenkins.server");

        expect(mod.isJenkinsNotFound({ response: { status: 500 } })).toBe(
            false,
        );
    });
});
