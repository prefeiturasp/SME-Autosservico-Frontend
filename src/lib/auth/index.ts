import { autenticaCoreSSO } from "@/lib/axios";
import { AxiosError } from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
                rf: {
                    label: "RF",
                    type: "text",
                    placeholder: "1234567",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials?.rf || !credentials?.password) {
                    return null;
                }

                const loginResponse = await Login({
                    login: credentials.rf as string,
                    senha: credentials.password as string,
                });

                // Caso 1: Senha inválida (status 401)
                if (loginResponse.status === 401) {
                    //console.log("Senha inválida:", loginResponse.detail);
                    throw new Error("Senha inválida!");
                }

                // Caso 2: Login não encontrado (sem status, mas com detail de erro)
                if (!loginResponse.nome && loginResponse.detail) {
                    //console.log("Login não encontrado:", loginResponse.detail);
                    throw new Error("Usuário não encontrado!");
                }

                // Caso 3: Sucesso - verifica se tem os dados essenciais
                if (!loginResponse.nome || !loginResponse.login) {
                    //console.log("Resposta inválida da API:", loginResponse);
                    throw new Error("Erro interno no servidor!");
                }

                // Retorna o objeto user com os novos campos
                return {
                    id: loginResponse.login,
                    name: loginResponse.nome,
                    email: loginResponse.email || "",
                    rf: loginResponse.login,
                    cpf: loginResponse.cpf,
                    situacaoUsuario: loginResponse.situacaoUsuario,
                    situacaoGrupo: loginResponse.situacaoGrupo,
                    visoes: loginResponse.visoes || [],
                    perfis_por_sistema: loginResponse.perfis_por_sistema || [],
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.rf = user.rf;
                token.cpf = user.cpf;
                token.situacaoUsuario = user.situacaoUsuario;
                token.situacaoGrupo = user.situacaoGrupo;
                token.visoes = user.visoes;
                token.perfis_por_sistema = user.perfis_por_sistema;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.rf = token.rf as string;
                session.user.cpf = token.cpf as string;
                session.user.situacaoUsuario = token.situacaoUsuario as number;
                session.user.situacaoGrupo = token.situacaoGrupo as number;
                session.user.visoes = token.visoes as string[];
                session.user.perfis_por_sistema = token.perfis_por_sistema as {
                    sistema: number;
                    perfis: string[];
                }[];
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
});
