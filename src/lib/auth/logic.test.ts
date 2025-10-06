// src/lib/auth/logic.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import {
    PERFIL_NOT_FOUND_ERROR_MESSAGE,
    PERFIL_NOT_PERMISSION_ERROR_MESSAGE,
} from "@/const";

// Mocks (devem usar os MESMOS especifiers que logic.ts usa)
vi.mock("./index", () => ({ __esModule: true, Login: vi.fn() }));
vi.mock("./validacoes", () => ({
    __esModule: true,
    temPermissaoDeAcesso: vi.fn(),
    temPermissaoDeAcessoV2: vi.fn(),
}));

import { authorizeUser, jwtCallback, sessionCallback } from "./logic";
import { Login } from "./index";
import { temPermissaoDeAcesso, temPermissaoDeAcessoV2 } from "./validacoes";


describe("auth/logic", () => {
    it("v2: groups undefined chama temPermissaoDeAcessoV2([]) e lança erro se sem permissão", async () => {
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            name: "Key User",
            preferred_username: "keyuser",
            // groups: undefined
        });
        (temPermissaoDeAcessoV2 as unknown as Mock).mockReturnValueOnce(false);

        await expect(
            authorizeUser({ rf: "keyuser", password: "x" })
        ).rejects.toThrow(PERFIL_NOT_PERMISSION_ERROR_MESSAGE);
        expect(temPermissaoDeAcessoV2).toHaveBeenCalledWith([]);
    });
    const OLD_ENV = { ...process.env };
    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...OLD_ENV };
    });

    // ---------- authorizeUser ----------

    it("retorna null quando credenciais ausentes", async () => {
        await expect(authorizeUser(undefined)).resolves.toBeNull();
        await expect(authorizeUser({ rf: "123" })).resolves.toBeNull();
    });

    it("status 401 → lança PERFIL_NOT_FOUND_ERROR_MESSAGE", async () => {
        (Login as unknown as Mock).mockResolvedValueOnce({ status: 401 });

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(PERFIL_NOT_FOUND_ERROR_MESSAGE);
        expect(Login).toHaveBeenCalledWith({ login: "123", senha: "x" }, "v1");
    });

    it("!nome && detail → lança PERFIL_NOT_FOUND_ERROR_MESSAGE", async () => {
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "",
            detail: "usuário inválido",
        });

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(PERFIL_NOT_FOUND_ERROR_MESSAGE);
    });


    it("sem permissão v1 → lança PERFIL_NOT_PERMISSION_ERROR_MESSAGE", async () => {
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v1";
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "João",
            login: "123",
            perfis_por_sistema: [],
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValueOnce(false);

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(PERFIL_NOT_PERMISSION_ERROR_MESSAGE);
    });

    it("sem permissão v2 (Keycloak) → lança PERFIL_NOT_PERMISSION_ERROR_MESSAGE", async () => {
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            name: "Joana",
            preferred_username: "999",
            groups: ["G_X"],
        });
        (temPermissaoDeAcessoV2 as unknown as Mock).mockReturnValueOnce(false);

        await expect(
            authorizeUser({ rf: "999", password: "x" })
        ).rejects.toThrow(PERFIL_NOT_PERMISSION_ERROR_MESSAGE);
        expect(temPermissaoDeAcessoV2).toHaveBeenCalledWith(["G_X"]);
    });

    it('falta "nome" ou "login" → lança "Erro interno no servidor!"', async () => {
        // caso 1: falta login
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "João",
            login: "",
            perfis_por_sistema: [],
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValue(true);

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(/Erro interno no servidor/i);

        // caso 2: falta nome
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "",
            login: "123",
            perfis_por_sistema: [],
        });

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(/Erro interno no servidor/i);
    });


    it("happy path v1 → retorna User normalizado", async () => {
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v1";
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "João Silva",
            login: "12345678",
            email: "joao@example.com",
            cpf: "00011122233",
            situacaoUsuario: 1,
            situacaoGrupo: 2,
            visoes: ["A", "B"],
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValueOnce(true);

        const user = await authorizeUser({
            rf: "12345678",
            password: "secret",
        });
        expect(user).toEqual<User>({
            id: "12345678",
            name: "João Silva",
            email: "joao@example.com",
            rf: "12345678",
            cpf: "00011122233",
            situacaoUsuario: 1,
            situacaoGrupo: 2,
            visoes: ["A", "B"],
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
            groups: [],
            given_name: undefined,
            family_name: undefined,
        });
    });

    it("happy path v2 (Keycloak) → retorna User normalizado com groups", async () => {
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            name: "Angela",
            preferred_username: "6913261",
            email: "angela@sme.gov.br",
            groups: ["G_ASCOM", "G_GIPE"],
            given_name: "Angela",
            family_name: "Regina Sampaio Nunes",
        });
        (temPermissaoDeAcessoV2 as unknown as Mock).mockReturnValueOnce(true);

        const user = await authorizeUser({
            rf: "6913261",
            password: "secret",
        });
        expect(user).toEqual<User>({
            id: "6913261",
            name: "Angela",
            email: "angela@sme.gov.br",
            rf: "6913261",
            cpf: undefined,
            situacaoUsuario: undefined,
            situacaoGrupo: undefined,
            visoes: [],
            perfis_por_sistema: [],
            groups: ["G_ASCOM", "G_GIPE"],
            given_name: "Angela",
            family_name: "Regina Sampaio Nunes",
        });
    });

    // ---------- jwtCallback ----------

    it("jwtCallback copia campos quando user presente", () => {
        const token: JWT = { rf: "" };
        const user: User = {
            id: "id1",
            rf: "rf1",
            cpf: "cpf1",
            situacaoUsuario: 1,
            situacaoGrupo: 2,
            visoes: ["V"],
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
        };
        const out = jwtCallback({ token, user });
        expect(out).toMatchObject({
            id: "id1",
            rf: "rf1",
            cpf: "cpf1",
            situacaoUsuario: 1,
            situacaoGrupo: 2,
            visoes: ["V"],
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
        });
    });

    it("jwtCallback retorna token inalterado quando user ausente", () => {
        const token: JWT = { foo: "bar" } as unknown as JWT;
        const out = jwtCallback({ token });
        expect(out).toBe(token);
        expect((out as Record<string, unknown>).foo).toBe("bar");
    });

    // ---------- sessionCallback ----------

    it("sessionCallback copia campos quando token presente", () => {
        const session: Session = { user: { rf: "" } as User, expires: "2099-01-01" };
        const token: JWT = {
            rf: "rf1",
            cpf: "cpf1",
            situacaoUsuario: 1,
            situacaoGrupo: 2,
            visoes: ["V"],
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
        } as JWT;

        const out = sessionCallback({ session, token });
        expect(out.user).toMatchObject({
            rf: "rf1",
            cpf: "cpf1",
            situacaoUsuario: 1,
            situacaoGrupo: 2,
            visoes: ["V"],
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
        });
    });

    it("sessionCallback retorna a session inalterada quando token ausente", () => {
        const session: Session = { user: {} as User, expires: "2099-01-01" };
        const out = sessionCallback({ session });
        // continua sem campos copiados
        expect((out.user as Partial<User>).rf).toBeUndefined();
        expect((out.user as Partial<User>).cpf).toBeUndefined();
    });

    it("perfis_por_sistema undefined → temPermissaoDeAcesso([]) chamado; sem permissão lança erro", async () => {
        // Login OK mas sem perfis_por_sistema
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "João",
            login: "123",
            // perfis_por_sistema: undefined
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValueOnce(false);

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(PERFIL_NOT_PERMISSION_ERROR_MESSAGE);

        // garante que o branch do "?? []" foi usado
        expect(temPermissaoDeAcesso).toHaveBeenCalledWith([]);
    });

    it("retorna null quando faltar rf (lado esquerdo do OR de credenciais)", async () => {
        await expect(authorizeUser({ password: "x" })).resolves.toBeNull();
    });

    it("não lança PERFIL_NOT_FOUND quando detail existe mas nome também existe (segue o fluxo)", async () => {
        const { Login } = await import("./index");
        const { temPermissaoDeAcesso } = await import("./validacoes");
        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "João",
            login: "123",
            email: "j@example.com",
            detail: "mensagem qualquer",
            perfis_por_sistema: [{ sistema: 1008, perfis: ["COPED"] }],
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValueOnce(true);

        const user = await authorizeUser({ rf: "123", password: "x" });
        expect(user).toMatchObject({
            id: "123",
            name: "João",
            email: "j@example.com",
        });
    });

    it("ambos nome e login ausentes → erro interno (ambos lados do || verdadeiros)", async () => {
        const { Login } = await import("./index");
        const { temPermissaoDeAcesso } = await import("./validacoes");

        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "",
            login: "",
            perfis_por_sistema: [],
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValueOnce(true);

        await expect(
            authorizeUser({ rf: "123", password: "x" })
        ).rejects.toThrow(/Erro interno no servidor/i);
    });

    it("happy path com opcionais indefinidos usa fallbacks (email '', visoes [], perfis [])", async () => {
        const { Login } = await import("./index");
        const { temPermissaoDeAcesso } = await import("./validacoes");

        (Login as unknown as Mock).mockResolvedValueOnce({
            status: 200,
            nome: "Maria",
            login: "999",
            // email: undefined,
            // visoes: undefined,
            // perfis_por_sistema: undefined,
            cpf: "12345678900",
            situacaoUsuario: 1,
            situacaoGrupo: 1,
        });
        (temPermissaoDeAcesso as unknown as Mock).mockReturnValueOnce(true);

        const user = await authorizeUser({ rf: "999", password: "ok" });

        // ✅ cobre os ramos do ?? (fallbacks)
        expect(user).toMatchObject({
            id: "999",
            name: "Maria",
            email: "", // fallback do email ?? ""
            visoes: [], // fallback do visoes ?? []
            perfis_por_sistema: [], // fallback do perfis_por_sistema ?? []
            cpf: "12345678900",
            situacaoUsuario: 1,
            situacaoGrupo: 1,
            rf: "999",
        });
    });
});
