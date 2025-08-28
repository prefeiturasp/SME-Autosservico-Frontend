import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ Next's "server-only" não existe no ambiente do Vitest → criamos um mock virtual

let postMock: ReturnType<typeof vi.fn> | undefined;

// ✅ Mock do axios (create → { post })
vi.mock("axios", () => {
    postMock = vi.fn();
    return {
        default: {
            create: vi.fn(() => ({ post: postMock })),
        },
    };
});

describe("zabbix.server zabbixRpc", () => {
    beforeEach(() => {
        // reavalia módulos entre testes (para refletir mudanças de ENV e mocks)
        vi.resetModules();

        // ENVs padrão
        process.env.ZABBIX_API_URL = "http://example/api_jsonrpc.php";
        process.env.ZABBIX_API_TOKEN = "token";

        if (postMock) postMock.mockReset();
    });

    it("env ausentes → lança erro no import", async () => {
        delete process.env.ZABBIX_API_URL;
        delete process.env.ZABBIX_API_TOKEN;

        await expect(import("@/lib/zabbix.server")).rejects.toThrow(
            /ZABBIX_API_URL|ZABBIX_API_TOKEN/i
        );
    });

    it("retorna result (happy path)", async () => {
        const mod = await import("@/lib/zabbix.server");
        if (!postMock) throw new Error("postMock não inicializado");

        postMock.mockResolvedValue({
            data: { jsonrpc: "2.0", result: [{ ok: true }] },
        });

        const result = await mod.zabbixRpc<{ ok: boolean }[]>(
            "trigger.get",
            { a: 1 },
            2
        );
        expect(result).toEqual([{ ok: true }]);
        expect(postMock).toHaveBeenCalledWith("", {
            jsonrpc: "2.0",
            method: "trigger.get",
            params: { a: 1 },
            id: 2,
        });
    });

    it("erro do Zabbix → lança", async () => {
        const mod = await import("@/lib/zabbix.server");
        if (!postMock) throw new Error("postMock não inicializado");

        postMock.mockResolvedValue({
            data: {
                jsonrpc: "2.0",
                error: { code: -32602, message: "Invalid params" },
            },
        });

        await expect(mod.zabbixRpc("trigger.get", {})).rejects.toThrow(
            /Invalid params/
        );
    });

    it("resposta não-JSON → lança", async () => {
        const mod = await import("@/lib/zabbix.server");
        if (!postMock) throw new Error("postMock não inicializado");

        postMock.mockResolvedValue({ data: "<html>nginx</html>" });

        await expect(mod.zabbixRpc("trigger.get", {})).rejects.toThrow(
            /não-JSON/i
        );
    });

    it("env ausente apenas URL → lança erro claro", async () => {
        delete process.env.ZABBIX_API_URL;
        process.env.ZABBIX_API_TOKEN = "token";
        await expect(import("@/lib/zabbix.server")).rejects.toThrow(
            /ZABBIX_API_URL/i
        );
    });

    it("env ausente apenas TOKEN → lança erro claro", async () => {
        process.env.ZABBIX_API_URL = "http://example/api_jsonrpc.php";
        delete process.env.ZABBIX_API_TOKEN;
        await expect(import("@/lib/zabbix.server")).rejects.toThrow(
            /ZABBIX_API_TOKEN/i
        );
    });

    it("rejeição do axios (ex.: erro de rede) → propaga o erro", async () => {
        const mod = await import("@/lib/zabbix.server");
        // @ts-expect-error postMock vem do mock de axios
        postMock.mockRejectedValue(new Error("network down"));
        await expect(mod.zabbixRpc("trigger.get", {})).rejects.toThrow(
            /network down/i
        );
    });

    it("erro do Zabbix com 'data' detalhado → mensagem inclui os detalhes", async () => {
        const mod = await import("@/lib/zabbix.server");
        // @ts-expect-error postMock vem do vi.mock('axios') do topo
        postMock.mockResolvedValue({
            data: {
                jsonrpc: "2.0",
                error: {
                    code: -32000,
                    message: "Trigger not found",
                    data: "extra info",
                },
            },
        });

        await expect(mod.zabbixRpc("trigger.get", {})).rejects.toThrow(
            /Trigger not found - extra info/
        );
    });
});
