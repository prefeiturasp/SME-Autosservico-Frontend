import { Login } from "./index";
import { temPermissaoDeAcesso } from "./validacoes";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Necessário isolar a lógica de autenticação para atingir a cobertura de testes

export async function authorizeUser(
    credentials: Partial<Record<"rf" | "password", unknown>> | undefined
): Promise<User | null> {
    if (!credentials?.rf || !credentials?.password) {
        return null;
    }

    const loginResponse = await Login({
        login: credentials.rf as string,
        senha: credentials.password as string,
    });

    if (loginResponse.status === 401) {
        throw new Error("Senha inválida!");
    }

    if (!loginResponse.nome && loginResponse.detail) {
        throw new Error("Usuário não encontrado!");
    }

    const acessoPermitido = temPermissaoDeAcesso(
        loginResponse.perfis_por_sistema || []
    );

    if (!acessoPermitido) {
        throw new Error("Você não tem permissão para acessar este sistema.");
    }

    if (!loginResponse.nome || !loginResponse.login) {
        throw new Error("Erro interno no servidor!");
    }

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
}

export function jwtCallback({ token, user }: { token: JWT; user?: User }): JWT {
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
}

export function sessionCallback({
    session,
    token,
}: {
    session: Session;
    token?: JWT;
}): Session {
    if (token) {
        session.user.rf = token.rf;
        session.user.cpf = token.cpf;
        session.user.situacaoUsuario = token.situacaoUsuario;
        session.user.situacaoGrupo = token.situacaoGrupo;
        session.user.visoes = token.visoes;
        session.user.perfis_por_sistema = token.perfis_por_sistema;
    }
    return session;
}
