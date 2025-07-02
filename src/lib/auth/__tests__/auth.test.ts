import { describe, it, expect, vi, beforeEach } from "vitest";
import { setupMocks, resetEnv, cleanupMocks, autenticaCoreSSOMock } from "./auth.mocks";
import {
  createUserData,
  createLoginResponse,
  createAxiosError,
  mockAuthorize
} from "./auth.test-utils";
import {
  LoginResponse,
  JwtToken,
  Session,
  Token,
  User
} from "./auth.types";
import { Login } from "@/lib/auth";

// Configuração inicial
setupMocks();

describe("Login Function", () => {
  beforeEach(() => {
    cleanupMocks();
    resetEnv();
  });

  describe("Casos de sucesso", () => {
    it("faz login com sucesso e retorna dados do usuário", async () => {
      const mockData = createLoginResponse();
      autenticaCoreSSOMock.post.mockResolvedValue({ data: mockData });

      const loginData = {
        login: mockData.login!,
        senha: "senha123",
      };

      const result = await Login(loginData);

      expect(autenticaCoreSSOMock.post).toHaveBeenCalledWith(
        "/autenticacao/",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token test-token"
          }
        }
      );
      expect(result).toEqual(mockData);
    });

    it("autentica com sucesso com dados mínimos", async () => {
      const mockData: LoginResponse = {
        nome: "Maria Souza",
        login: "7654321",
        situacaoUsuario: 1,
        situacaoGrupo: 1,
      };
      autenticaCoreSSOMock.post.mockResolvedValue({ data: mockData });

      const result = await Login({
        login: "7654321",
        senha: "outrasenha"
      });

      expect(result).toEqual(mockData);
    });

    it("lida com múltiplos sistemas e perfis", async () => {
      const mockData: LoginResponse = {
        nome: "Admin Geral",
        login: "admin",
        situacaoUsuario: 1,
        situacaoGrupo: 1,
        perfis_por_sistema: [
          { sistema: 1, perfis: ["admin", "gestor"] },
          { sistema: 2, perfis: ["supervisor"] }
        ]
      };
      autenticaCoreSSOMock.post.mockResolvedValue({ data: mockData });

      const result = await Login({
        login: "admin",
        senha: "senhasecreta"
      });

      expect(result.perfis_por_sistema).toHaveLength(2);
      expect(result.perfis_por_sistema).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ sistema: 1 }),
          expect.objectContaining({ sistema: 2 })
        ])
      );
    });
  });

  describe("Casos de erro", () => {
    it("retorna erro 401 para credenciais inválidas", async () => {
      const errorData = {
        detail: "Credenciais inválidas",
        operation_id: "op-123"
      };

      // Cria um erro Axios real
      const axiosError = createAxiosError(401, errorData);
      autenticaCoreSSOMock.post.mockRejectedValue(axiosError);

      const result = await Login({
        login: "12345678",
        senha: "senhaerrada"
      });

      expect(result).toEqual({
        status: 401,
        ...errorData
      });
    });

     it("retorna erro 404 para usuário não encontrado", async () => {
      const errorData = {
        detail: "Usuário não encontrado",
        operation_id: "op-456"
      };

      // Cria um erro Axios real
      const axiosError = createAxiosError(404, errorData);
      autenticaCoreSSOMock.post.mockRejectedValue(axiosError);

      const result = await Login({
        login: "99999999",
        senha: "senha123"
      });

      expect(result).toEqual({
        status: 404,
        ...errorData
      });
    });

    it("lança erro quando AUTENTICA_CORESSO_API_URL não está definida", async () => {
      vi.stubEnv("AUTENTICA_CORESSO_API_URL", "");

      await expect(Login({
        login: "12345678",
        senha: "senha123"
      })).rejects.toThrow(
        "AUTENTICA_CORESSO_API_URL não está definida"
      );
    });

    it("lança erro quando AUTENTICA_CORESSO_API_TOKEN não está definida", async () => {
      vi.stubEnv("AUTENTICA_CORESSO_API_TOKEN", "");

      await expect(Login({
        login: "12345678",
        senha: "senha123"
      })).rejects.toThrow(
        "AUTENTICA_CORESSO_API_TOKEN não está definida"
      );
    });

    it("lança erro para exceções não-Axios", async () => {
      autenticaCoreSSOMock.post.mockRejectedValue(new Error("Network error"));

      await expect(Login({
        login: "12345678",
        senha: "senha123"
      })).rejects.toThrow("Network error");
    });

    it("retorna erro genérico para respostas inesperadas", async () => {
      // Cria um erro Axios sem dados detalhados
      const axiosError = createAxiosError(500, {});
      autenticaCoreSSOMock.post.mockRejectedValue(axiosError);

      const result = await Login({
        login: "12345678",
        senha: "senha123"
      });

      expect(result).toEqual({
        status: 500,
        detail: undefined,
        operation_id: undefined
      });
    });
  });
});

describe("Authorization Logic", () => {
  it("retorna null quando credenciais ausentes", async () => {
    const mockLogin = vi.fn();
    const result = await mockAuthorize({}, mockLogin);
    expect(result).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("retorna null quando RF ausente", async () => {
    const mockLogin = vi.fn();
    const result = await mockAuthorize({ password: "senha123" }, mockLogin);
    expect(result).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("retorna null quando senha ausente", async () => {
    const mockLogin = vi.fn();
    const result = await mockAuthorize({ rf: "12345678" }, mockLogin);
    expect(result).toBeNull();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('lança "Senha inválida!" para status 401', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      status: 401,
      detail: "Credenciais inválidas"
    });

    await expect(
      mockAuthorize(
        { rf: "12345678", password: "senhaerrada" },
        mockLogin
      )
    ).rejects.toThrow("Senha inválida!");
  });

  it('lança "Usuário não encontrado!" quando há detail mas sem nome', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      detail: "Usuário não encontrado"
    });

    await expect(
      mockAuthorize(
        { rf: "99999999", password: "senha123" },
        mockLogin
      )
    ).rejects.toThrow("Usuário não encontrado!");
  });

  it('lança "Erro interno no servidor!" para resposta inválida', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      nome: null,
      login: null
    });

    await expect(
      mockAuthorize(
        { rf: "12345678", password: "senha123" },
        mockLogin
      )
    ).rejects.toThrow("Erro interno no servidor!");
  });

  it("retorna objeto user para login válido", async () => {
    const userData = createUserData();
    const mockLogin = vi.fn().mockResolvedValue({
      nome: userData.name,
      login: userData.rf,
      email: userData.email,
      cpf: userData.cpf,
      situacaoUsuario: userData.situacaoUsuario,
      situacaoGrupo: userData.situacaoGrupo,
      visoes: userData.visoes,
      perfis_por_sistema: userData.perfis_por_sistema
    });

    const result = await mockAuthorize(
      { rf: userData.rf, password: "senha123" },
      mockLogin
    );

    expect(result).toEqual(userData);
  });

  it("usa valores padrão para campos opcionais ausentes", async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      nome: "João Silva",
      login: "12345678",
      cpf: "12345678901",
      situacaoUsuario: 1,
      situacaoGrupo: 1
    });

    const result = await mockAuthorize(
      { rf: "12345678", password: "senha123" },
      mockLogin
    );

    expect(result).toEqual({
      id: "12345678",
      name: "João Silva",
      email: "",
      rf: "12345678",
      cpf: "12345678901",
      situacaoUsuario: 1,
      situacaoGrupo: 1,
      visoes: [],
      perfis_por_sistema: []
    });
  });
});

describe("Callback Logic", () => {
  describe("JWT Callback", () => {
    const jwtCallback = (token: JwtToken, user?: User | null) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          rf: user.rf,
          cpf: user.cpf,
          situacaoUsuario: user.situacaoUsuario,
          situacaoGrupo: user.situacaoGrupo,
          visoes: user.visoes,
          perfis_por_sistema: user.perfis_por_sistema
        };
      }
      return token;
    };

    it("adiciona dados do usuário ao token", () => {
      const initialToken = { name: "João Silva", email: "joao@teste.com" };
      const user = createUserData();

      const result = jwtCallback(initialToken, user);

      expect(result).toEqual({
        ...initialToken,
        id: user.id,
        rf: user.rf,
        cpf: user.cpf,
        situacaoUsuario: user.situacaoUsuario,
        situacaoGrupo: user.situacaoGrupo,
        visoes: user.visoes,
        perfis_por_sistema: user.perfis_por_sistema
      });
    });

    it("mantém token inalterado sem usuário", () => {
      const initialToken = { name: "João Silva", email: "joao@teste.com" };
      const result = jwtCallback(initialToken, null);
      expect(result).toEqual(initialToken);
    });
  });

  describe("Session Callback", () => {
    const sessionCallback = (session: Session, token?: Token | null) => {
      if (token) {
        return {
          user: {
            ...session.user,
            id: token.id as string,
            rf: token.rf as string,
            cpf: token.cpf as string,
            situacaoUsuario: token.situacaoUsuario as number,
            situacaoGrupo: token.situacaoGrupo as number,
            visoes: token.visoes as string[],
            perfis_por_sistema: token.perfis_por_sistema as {
              sistema: number;
              perfis: string[];
            }[]
          }
        };
      }
      return session;
    };

    it("adiciona dados do token à sessão", () => {
      const initialSession: Session = {
        user: { name: "João Silva", email: "joao@teste.com" }
      };

      const token: Token = {
        id: "12345678",
        rf: "12345678",
        cpf: "12345678901",
        situacaoUsuario: 1,
        situacaoGrupo: 1,
        visoes: ["admin"],
        perfis_por_sistema: [{ sistema: 1, perfis: ["admin"] }]
      };

      const result = sessionCallback(initialSession, token);

      expect(result.user).toEqual({
        ...initialSession.user,
        ...token
      });
    });

    it("mantém sessão inalterada sem token", () => {
      const initialSession: Session = {
        user: { name: "João Silva", email: "joao@teste.com" }
      };

      const result = sessionCallback(initialSession, null);
      expect(result).toEqual(initialSession);
    });
  });
});
