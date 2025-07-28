
import type { Session } from "next-auth";
import { vi, describe, it, expect } from "vitest";
import type { JWT } from "next-auth/jwt";


vi.mock("next-auth", () => ({
  default: () => ({
    handlers: {},
    signIn: vi.fn(),
    signOut: vi.fn(),
    auth: vi.fn(),
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  AuthError: class MockAuthError extends Error {
    constructor() {
      super("MockAuthError");
      this.name = "AuthError";
    }
    type = "CredentialsSignin";
  },
}));

vi.mock("next/server", () => ({}));

// 🧪 Mocks internos dos módulos da aplicação
import { Login } from "../index";
import { temPermissaoDeAcesso } from "../validacoes";

vi.mock("../index", () => ({
  Login: vi.fn(),
}));

vi.mock("../validacoes", () => ({
  temPermissaoDeAcesso: vi.fn(),
}));

// Importa as funções testáveis após mocks
import { authorizeUser, jwtCallback, sessionCallback } from "../logic";
import { createUserData, createLoginResponse } from "./auth.test-utils";

// Mock helpers com tipagem segura
const mockedLogin = Login as unknown as ReturnType<typeof vi.fn>;
const mockedPermissao = temPermissaoDeAcesso as unknown as ReturnType<typeof vi.fn>;

describe("authorizeUser", () => {
  it("retorna null se rf ou password não forem fornecidos", async () => {
    expect(await authorizeUser(undefined)).toBeNull();
  });

  it("lança erro se status 401", async () => {
    mockedLogin.mockResolvedValue({ status: 401 });
    await expect(
      authorizeUser({ rf: "123", password: "errada" })
    ).rejects.toThrow("Senha inválida!");
  });

  it("lança erro se não tiver nome e tiver detail", async () => {
    mockedLogin.mockResolvedValue({ detail: "Usuário não encontrado" });
    await expect(
      authorizeUser({ rf: "123", password: "qualquer" })
    ).rejects.toThrow("Usuário não encontrado!");
  });

  it("lança erro se acesso não for permitido", async () => {
    mockedLogin.mockResolvedValue(createLoginResponse());
    mockedPermissao.mockReturnValue(false);
    await expect(
      authorizeUser({ rf: "123", password: "qualquer" })
    ).rejects.toThrow("Você não tem permissão para acessar este sistema.");
  });

  it("lança erro se nome ou login estiverem ausentes", async () => {
    mockedLogin.mockResolvedValue({
      nome: null,
      login: null,
      perfis_por_sistema: [],
    });
    mockedPermissao.mockReturnValue(true);
    await expect(
      authorizeUser({ rf: "123", password: "senha" })
    ).rejects.toThrow("Erro interno no servidor!");
  });

  it("retorna objeto user válido em caso de sucesso", async () => {
    const userData = createUserData();
    mockedLogin.mockResolvedValue({
      nome: userData.name,
      login: userData.rf,
      email: userData.email,
      cpf: userData.cpf,
      situacaoUsuario: userData.situacaoUsuario,
      situacaoGrupo: userData.situacaoGrupo,
      visoes: userData.visoes,
      perfis_por_sistema: userData.perfis_por_sistema,
    });
    mockedPermissao.mockReturnValue(true);

    const result = await authorizeUser({ rf: "123", password: "senha" });
    expect(result).toMatchObject({
      id: userData.rf,
      name: userData.name,
      email: userData.email,
    });
  });
});

describe("jwtCallback", () => {
  it("adiciona dados ao token quando user está presente", () => {
    const user = createUserData();
    const token = jwtCallback({ token: {} as JWT, user });
    expect(token).toMatchObject({
      rf: user.rf,
      cpf: user.cpf,
      situacaoUsuario: user.situacaoUsuario,
      situacaoGrupo: user.situacaoGrupo,
      visoes: user.visoes,
      perfis_por_sistema: user.perfis_por_sistema,
    });
  });

    it("retorna token inalterado quando user está ausente", () => {
        const token = jwtCallback({ token: {} as JWT });
        expect(token).toEqual({});
    }
  );
});

describe("sessionCallback", () => {
  it("preenche a sessão com dados do token", () => {
    const session: Session = {
      user: { rf: "placeholder" }, // rf obrigatório
      expires: "2099-01-01T00:00:00.000Z",
    };

    const token: JWT = {
      rf: "123",
      cpf: "999",
      situacaoUsuario: 1,
      situacaoGrupo: 2,
      visoes: ["UE"],
      perfis_por_sistema: [{ sistema: 1, perfis: ["admin"] }],
    };

    const result = sessionCallback({ session, token });
    expect(result.user).toMatchObject(token);
  });

  it("mantém a sessão inalterada quando token está ausente", () => {
    const original: Session = {
      user: { name: "Original", rf: "placeholder" }, // rf obrigatório
      expires: "2099-01-01T00:00:00.000Z",
    };

    expect(sessionCallback({ session: original })).toEqual(original);
  });
});
