import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loginCoreSSO, loginKeycloak } from "../strategies";
import { AxiosError, AxiosHeaders } from "axios";

// Mocks
vi.mock("@/lib/axios", () => ({
    autenticaCoreSSO: { post: vi.fn() },
    autenticaKeycloak: { post: vi.fn() },
}));

const mockJwtVerify = vi.fn();
vi.mock("jose", () => ({
    createRemoteJWKSet: vi.fn(() => "mock-jwks"),
    jwtVerify: (...args: unknown[]) => mockJwtVerify(...args),
}));

import { autenticaCoreSSO, autenticaKeycloak } from "@/lib/axios";

describe("loginCoreSSO", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        process.env = { ...OLD_ENV };
        process.env.AUTENTICA_CORESSO_API_URL = "http://api";
        process.env.AUTENTICA_CORESSO_API_TOKEN = "token";
        vi.resetAllMocks();
    });
    afterEach(() => {
        process.env = OLD_ENV;
    });

    it("lança erro se AUTENTICA_CORESSO_API_URL não definida", async () => {
        delete process.env.AUTENTICA_CORESSO_API_URL;
        await expect(loginCoreSSO({ login: "a", senha: "b" })).rejects.toThrow(/AUTENTICA_CORESSO_API_URL/);
    });

    it("lança erro se AUTENTICA_CORESSO_API_TOKEN não definida", async () => {
        delete process.env.AUTENTICA_CORESSO_API_TOKEN;
        await expect(loginCoreSSO({ login: "a", senha: "b" })).rejects.toThrow(/AUTENTICA_CORESSO_API_TOKEN/);
    });

    it("retorna data em caso de sucesso", async () => {
        vi.mocked(autenticaCoreSSO.post).mockResolvedValueOnce({ data: { status: 200, nome: "João" } });
        const resp = await loginCoreSSO({ login: "a", senha: "b" });
        expect(resp).toEqual({ status: 200, nome: "João" });
        expect(autenticaCoreSSO.post).toHaveBeenCalledWith(
            "/autenticacao/",
            { login: "a", senha: "b" },
            expect.objectContaining({ headers: expect.any(Object) })
        );
    });

    it("retorna status e detail em erro AxiosError com response", async () => {
        const error = new AxiosError("fail");
        error.response = {
            status: 401,
            data: { detail: "msg", operation_id: "opid" },
            statusText: "Unauthorized",
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() },
        };
        vi.mocked(autenticaCoreSSO.post).mockRejectedValueOnce(error);
        const resp = await loginCoreSSO({ login: "a", senha: "b" });
        expect(resp).toEqual({ status: 401, detail: "msg", operation_id: "opid" });
    });

    it("relança erro desconhecido", async () => {
        vi.mocked(autenticaCoreSSO.post).mockRejectedValueOnce(new Error("outra"));
        await expect(loginCoreSSO({ login: "a", senha: "b" })).rejects.toThrow("outra");
    });
});

describe("loginKeycloak", () => {
    it("lança erro se todos os envs obrigatórios estiverem ausentes", async () => {
        delete process.env.KEYCLOAK_CLIENT_ID;
        delete process.env.KEYCLOAK_CLIENT_SECRET;
        delete process.env.KEYCLOAK_GRANT_TYPE;
        delete process.env.KEYCLOAK_REALM;
        delete process.env.KEYCLOAK_URL;
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow();

        // restaura para não afetar outros testes
        process.env.KEYCLOAK_CLIENT_ID = "cid";
        process.env.KEYCLOAK_CLIENT_SECRET = "sec";
        process.env.KEYCLOAK_GRANT_TYPE = "password";
        process.env.KEYCLOAK_REALM = "realm";
        process.env.KEYCLOAK_URL = "http://kc";
    });
    it("lança erro se faltar clientSecret, grantType, realm ou keycloakUrl", async () => {
        // clientSecret
        delete process.env.KEYCLOAK_CLIENT_SECRET;
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow();
        process.env.KEYCLOAK_CLIENT_SECRET = "sec";

        // grantType
        delete process.env.KEYCLOAK_GRANT_TYPE;
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow();
        process.env.KEYCLOAK_GRANT_TYPE = "password";

        // realm
        delete process.env.KEYCLOAK_REALM;
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow();
        process.env.KEYCLOAK_REALM = "realm";

        // keycloakUrl
        delete process.env.KEYCLOAK_URL;
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow();
        process.env.KEYCLOAK_URL = "http://kc";
    });
    const OLD_ENV = process.env;
    beforeEach(() => {
        process.env = { ...OLD_ENV };
        process.env.KEYCLOAK_CLIENT_ID = "cid";
        process.env.KEYCLOAK_CLIENT_SECRET = "sec";
        process.env.KEYCLOAK_GRANT_TYPE = "password";
        process.env.KEYCLOAK_REALM = "realm";
        process.env.KEYCLOAK_URL = "http://kc";
        vi.resetAllMocks();
    });
    afterEach(() => {
        process.env = OLD_ENV;
    });

    it("lança erro se faltar env obrigatória", async () => {
        delete process.env.KEYCLOAK_CLIENT_ID;
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow();
    });

    it("retorna payload verificado com assinatura válida e token em caso de sucesso", async () => {
        vi.mocked(autenticaKeycloak.post).mockResolvedValueOnce({ data: { access_token: "tok123" } });
        mockJwtVerify.mockResolvedValueOnce({
            payload: { name: "Nome", preferred_username: "user", groups: ["G1"] },
        });
        const resp = await loginKeycloak({ login: "a", senha: "b" });
        expect(resp).toMatchObject({ name: "Nome", preferred_username: "user", groups: ["G1"], keycloakToken: "tok123" });
        expect(autenticaKeycloak.post).toHaveBeenCalledWith(
            "/realms/realm/protocol/openid-connect/token",
            expect.any(URLSearchParams),
            expect.objectContaining({ headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        );
        expect(mockJwtVerify).toHaveBeenCalledWith("tok123", "mock-jwks");
    });

    it("retorna status e detail em erro AxiosError com response", async () => {
        const error = new AxiosError("fail");
        error.response = {
            status: 400,
            data: { error_description: "desc", operation_id: "opid" },
            statusText: "Bad Request",
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() },
        };
        vi.mocked(autenticaKeycloak.post).mockRejectedValueOnce(error);
        const resp = await loginKeycloak({ login: "a", senha: "b" });
        expect(resp).toEqual({ status: 400, detail: "desc", operation_id: "opid" });
    });

    it("retorna status e detail em erro AxiosError com response.detail", async () => {
        const error = new AxiosError("fail");
        error.response = {
            status: 403,
            data: { detail: "msg", operation_id: "opid2" },
            statusText: "Forbidden",
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() },
        };
        vi.mocked(autenticaKeycloak.post).mockRejectedValueOnce(error);
        const resp = await loginKeycloak({ login: "a", senha: "b" });
        expect(resp).toEqual({ status: 403, detail: "msg", operation_id: "opid2" });
    });

    it("relança erro desconhecido", async () => {
        vi.mocked(autenticaKeycloak.post).mockRejectedValueOnce(new Error("outra"));
        await expect(loginKeycloak({ login: "a", senha: "b" })).rejects.toThrow("outra");
    });
});
