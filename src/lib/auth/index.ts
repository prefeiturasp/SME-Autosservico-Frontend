import { autenticaCoreSSO } from "@/lib/axios";
import { AxiosError } from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// A lógica de autenticação foi isolada para permitir testes mais fáceis e atingir a cobertura de testes necessária
import { authorizeUser, jwtCallback, sessionCallback } from "./logic";

type LoginData = {
    login: string;
    senha: string;
};

type LoginResponse = {
    // Campos de erro (presentes quando há falha)
    status?: number;
    detail?: string;
    operation_id?: string;
    // Dados do usuário (presentes quando login é bem-sucedido)
    nome?: string;
    cpf?: string;
    email?: string;
    login?: string;
    situacaoUsuario?: number;
    situacaoGrupo?: number;
    visoes?: string[];
    perfis_por_sistema?: {
        sistema: number;
        perfis: string[];
    }[];
};
export async function Login(data: LoginData): Promise<LoginResponse> {
    try {
        if (!process.env.AUTENTICA_CORESSO_API_URL) {
            throw new Error("AUTENTICA_CORESSO_API_URL não está definida");
        }

        if (!process.env.AUTENTICA_CORESSO_API_TOKEN) {
            throw new Error("AUTENTICA_CORESSO_API_TOKEN não está definida");
        }

        const token = process.env.AUTENTICA_CORESSO_API_TOKEN;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        };

        const response = await autenticaCoreSSO.post("/autenticacao/", data, {
            headers: headers,
        });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError && e.response) {
            return {
                status: e.response.status,
                detail: e.response.data.detail,
                operation_id: e.response.data.operation_id,
            };
        }
        throw e;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        rf: { label: "RF", type: "text", placeholder: "1234567" },
        password: { label: "Password", type: "password" },
      },
      authorize: authorizeUser,
    }),
  ],
  pages: { signIn: "/" },
  callbacks: {
    jwt: jwtCallback,
    session: sessionCallback,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias - tempo de vida total
    updateAge: 24 * 60 * 60,   // 24 horas - intervalo entre renovações
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,     // Impede acesso via JavaScript (XSS protection)
        sameSite: "lax",    // Proteção CSRF
        path: "/",
        secure: process.env.NODE_ENV === "production", // HTTPS em produção
        maxAge: 30 * 24 * 60 * 60, // 30 dias
      },
    },
  },
  });
