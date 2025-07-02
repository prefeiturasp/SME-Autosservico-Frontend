import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import {
  LoginResponse,
  AuthCredentials,
  User
} from "./auth.types";

export const createUserData = (overrides?: Partial<User>): User => ({
  id: "12345678",
  name: "João Silva",
  email: "joao@teste.com",
  rf: "12345678",
  cpf: "12345678901",
  situacaoUsuario: 1,
  situacaoGrupo: 1,
  visoes: ["admin", "user"],
  perfis_por_sistema: [
    { sistema: 1, perfis: ["administrador", "usuario"] }
  ],
  ...overrides
});

export const createLoginResponse = (
  overrides?: Partial<LoginResponse>
): LoginResponse => ({
  nome: "João Silva",
  cpf: "12345678901",
  email: "joao@teste.com",
  login: "12345678",
  situacaoUsuario: 1,
  situacaoGrupo: 1,
  visoes: ["admin", "user"],
  perfis_por_sistema: [
    { sistema: 1, perfis: ["administrador", "usuario"] }
  ],
  ...overrides
});

export interface MockAxiosError extends Error {
  response?: {
    status: number;
    data: unknown;
    statusText: string;
    headers: unknown;
    config: AxiosRequestConfig;
  };
}

export const createAxiosError = <T = unknown>(
  status: number,
  data: T,
  config?: AxiosRequestConfig
): AxiosError<T> => {
  // Converter para InternalAxiosRequestConfig se necessário
  const internalConfig: InternalAxiosRequestConfig = config
    ? {
        ...config,
        headers: config.headers || {},
      } as InternalAxiosRequestConfig
    : {} as InternalAxiosRequestConfig;

  const error = new AxiosError(
    `Request failed with status code ${status}`,
    status.toString(),
    internalConfig,
    null,
    {
      data,
      status,
      statusText: "Error",
      headers: {},
      config: internalConfig,
    } as AxiosResponse<T>
  );

  return error;
};

export const mockAuthorize = async (
  credentials: AuthCredentials,
  loginFn: (data: { login: string; senha: string }) => Promise<LoginResponse>
) => {
  if (!credentials?.rf || !credentials?.password) return null;

  const loginResponse = await loginFn({
    login: credentials.rf,
    senha: credentials.password
  });

  if (loginResponse.status === 401) throw new Error("Senha inválida!");
  if (!loginResponse.nome && loginResponse.detail)
    throw new Error("Usuário não encontrado!");
  if (!loginResponse.nome || !loginResponse.login)
    throw new Error("Erro interno no servidor!");

  return {
    id: loginResponse.login!,
    name: loginResponse.nome!,
    email: loginResponse.email || "",
    rf: loginResponse.login!,
    cpf: loginResponse.cpf || "",
    situacaoUsuario: loginResponse.situacaoUsuario!,
    situacaoGrupo: loginResponse.situacaoGrupo!,
    visoes: loginResponse.visoes || [],
    perfis_por_sistema: loginResponse.perfis_por_sistema || []
  };
};
