import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock do NextAuth e suas dependências ANTES de qualquer import
vi.mock("next-auth", () => ({
    AuthError: class AuthError extends Error {
        type: string;
        constructor(message: string) {
            super(message);
            this.name = "AuthError";
            this.type = "";
        }
    },
}));

// Mock da função signIn do NextAuth
vi.mock("./auth", () => ({
    signIn: vi.fn(),
}));

// Mock do console para evitar logs durante os testes
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();
vi.stubGlobal("console", {
    log: mockConsoleLog,
    error: mockConsoleError,
});

// Mock do Next.js server
vi.mock("next/server", () => ({}));

// Agora importamos após os mocks
import { authenticate } from "./actions";
import { signIn } from "./auth";
import { AuthError } from "next-auth";

// Cast para ter acesso aos métodos de mock
const mockSignIn = vi.mocked(signIn);

describe("authenticate", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // Helper para criar FormData de teste
    const createFormData = (rf: string, password: string): FormData => {
        const formData = new FormData();
        formData.append("rf", rf);
        formData.append("password", password);
        return formData;
    };

    describe("Autenticação bem-sucedida", () => {
        it("deve chamar signIn com os parâmetros corretos", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = createFormData("1234567", "user123");
            const result = await authenticate(undefined, formData);

            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                rf: "1234567",
                password: "user123",
                redirectTo: "/dashboard",
                redirect: true,
            });

            expect(result).toBeUndefined(); // Função não retorna nada em caso de sucesso
        });

        it("deve processar campos vazios corretamente", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = new FormData();
            formData.append("rf", "");
            formData.append("password", "");

            const result = await authenticate(undefined, formData);

            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                rf: "",
                password: "",
                redirectTo: "/dashboard",
                redirect: true,
            });

            expect(result).toBeUndefined();
        });

        it("deve processar campos ausentes como null", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = new FormData();
            // Não adiciona email nem password

            const result = await authenticate(undefined, formData);

            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                rf: null,
                password: null,
                redirectTo: "/dashboard",
                redirect: true,
            });

            expect(result).toBeUndefined();
        });
    });

    describe("Tratamento de erros de autenticação", () => {
        it("deve retornar 'Invalid credentials.' para erro CredentialsSignin", async () => {
            const authError = new AuthError("Invalid credentials");
            authError.type = "CredentialsSignin";
            mockSignIn.mockRejectedValue(authError);

            const formData = createFormData(
                "user@example.com",
                "wrongpassword"
            );
            const result = await authenticate(undefined, formData);

            expect(result).toBe("Credenciais inválidas.");
        });

        it("deve retornar 'Algo deu errado. Tente novamente.' para outros tipos de AuthError", async () => {
            const authError = new AuthError("Unknown error");
            //authError.type = "Configuration";
            mockSignIn.mockRejectedValue(authError);

            const formData = createFormData("user@example.com", "password123");
            const result = await authenticate(undefined, formData);

            expect(result).toBe("Algo deu errado. Tente novamente.");
        });

        it("deve retornar 'Algo deu errado. Tente novamente.' para AuthError sem tipo específico", async () => {
            const authError = new AuthError("Unknown error");
            // Não define o tipo, deixa como string vazia
            mockSignIn.mockRejectedValue(authError);

            const formData = createFormData("user@example.com", "password123");
            const result = await authenticate(undefined, formData);

            expect(result).toBe("Algo deu errado. Tente novamente.");
        });

        it("deve retornar mensagem customizada para erro CallbackRouteError com causa", async () => {
            const authError = new AuthError("Callback error");
            authError.type = "CallbackRouteError";
            authError.cause = {
                err: {
                    name: "Error",
                    message: "Usuário não encontrado!",
                },
            };

            mockSignIn.mockRejectedValue(authError);

            const formData = createFormData("1234567", "password123");
            const result = await authenticate(undefined, formData);

            expect(result).toBe("Usuário não encontrado!");
        });

        it("deve retornar mensagem padrão para erro CallbackRouteError sem causa", async () => {
            const authError = new AuthError("Callback error");
            authError.type = "CallbackRouteError";
            // Sem propriedade cause
            mockSignIn.mockRejectedValue(authError);

            const formData = createFormData("1234567", "password123");
            const result = await authenticate(undefined, formData);

            expect(result).toBe("Erro na autenticação.");
        });

        it("deve retornar mensagem padrão para erro CallbackRouteError com causa sem mensagem", async () => {
            const authError = new AuthError("Callback error");
            authError.type = "CallbackRouteError";
            authError.cause = {
                err: { name: "", message: "" }, // Objeto Error válido, mas vazio
            };

            mockSignIn.mockRejectedValue(authError);

            const formData = createFormData("1234567", "password123");
            const result = await authenticate(undefined, formData);

            expect(result).toBe("Erro na autenticação.");
        });

    });

    describe("Tratamento de erros não relacionados à autenticação", () => {
        it("deve re-lançar erros que não são AuthError", async () => {
            const networkError = new Error("Network error");
            mockSignIn.mockRejectedValue(networkError);

            const formData = createFormData("user@example.com", "password123");

            await expect(authenticate(undefined, formData)).rejects.toThrow(
                "Network error"
            );
        });

        it("deve re-lançar erros de tipo TypeError", async () => {
            const typeError = new TypeError("Type error");
            mockSignIn.mockRejectedValue(typeError);

            const formData = createFormData("user@example.com", "password123");

            await expect(authenticate(undefined, formData)).rejects.toThrow(
                "Type error"
            );
        });
    });

    describe("Teste de estado anterior", () => {
        it("deve funcionar com prevState undefined", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = createFormData("user@example.com", "password123");
            const result = await authenticate(undefined, formData);

            expect(mockSignIn).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });

        it("deve funcionar com prevState definido", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = createFormData("user@example.com", "password123");
            const result = await authenticate("previous error", formData);

            expect(mockSignIn).toHaveBeenCalled();
            expect(result).toBeUndefined();
        });
    });

    describe("Validação de dados do formulário", () => {
        it("deve processar email com espaços", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = createFormData("  1234567  ", "password123");
            const result = await authenticate(undefined, formData);

            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                rf: "  1234567  ",
                password: "password123",
                redirectTo: "/dashboard",
                redirect: true,
            });

            expect(result).toBeUndefined();
        });

        it("deve processar caracteres especiais no password", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = createFormData("1234567", "p@ssw0rd!@#$%");
            const result = await authenticate(undefined, formData);

            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                rf: "1234567",
                password: "p@ssw0rd!@#$%",
                redirectTo: "/dashboard",
                redirect: true,
            });

            expect(result).toBeUndefined();
        });
    });

    describe("Comportamento de retorno", () => {
        it("deve retornar undefined quando não há erro (sucesso)", async () => {
            const mockRetorno = { success: true };
            mockSignIn.mockResolvedValue(mockRetorno);

            const formData = createFormData("user@example.com", "password123");
            const result = await authenticate(undefined, formData);

            expect(result).toBeUndefined();
        });
    });
});
