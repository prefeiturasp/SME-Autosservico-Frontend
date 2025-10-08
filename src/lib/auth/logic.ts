import { Login } from "./index";
import { temPermissaoDeAcesso, temPermissaoDeAcessoV2 } from "./validacoes";
import type { User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

import {PERFIL_NOT_FOUND_ERROR_MESSAGE, PERFIL_NOT_PERMISSION_ERROR_MESSAGE} from "@/const";

// Necessário isolar a lógica de autenticação para atingir a cobertura de testes
export async function authorizeUser(
    credentials: Partial<Record<"rf" | "password", unknown>> | undefined,

): Promise<User | null> {
    if (!credentials?.rf || !credentials?.password) {
        return null;
    }

    // Decide a versão dinamicamente: parâmetro > env > default v1
    const loginVersion = process.env.NEXT_PUBLIC_AUTH_VERSION as ("v1" | "v2") || "v1";

    const loginResponse = await Login({
        login: credentials.rf as string,
        senha: credentials.password as string,
    }, loginVersion);

    console.log("XXXXXXXXXXXxx Login response:", loginResponse);
    if (loginResponse.status === 401 || (!loginResponse.nome && loginResponse.detail)) {
        throw new Error(PERFIL_NOT_FOUND_ERROR_MESSAGE);
    }

    let acessoPermitido = false;
    if (loginVersion === "v2") {
        acessoPermitido = temPermissaoDeAcessoV2(loginResponse.groups ?? []);
    } else {
        acessoPermitido = temPermissaoDeAcesso(loginResponse.perfis_por_sistema ?? []);
    }

    if (!acessoPermitido) {
        throw new Error(PERFIL_NOT_PERMISSION_ERROR_MESSAGE);
    }

    // Mapeamento flexível para v1 (CORESSO) e v2 (Keycloak)
    // Para v2, prioriza os campos do Keycloak se existirem
    const id = loginResponse.preferred_username ?? loginResponse.login;
    const name = loginResponse.name ?? loginResponse.nome;
    const email = loginResponse.email ?? "";
    const rf = loginResponse.preferred_username ?? loginResponse.login ?? "";
    const cpf = loginResponse.cpf;
    const situacaoUsuario = loginResponse.situacaoUsuario;
    const situacaoGrupo = loginResponse.situacaoGrupo;
    const visoes = loginResponse.visoes ?? [];
    const perfis_por_sistema = loginResponse.perfis_por_sistema ?? [];
    const groups = loginResponse.groups ?? [];
    const given_name = loginResponse.given_name;
    const family_name = loginResponse.family_name;

    if (!name || !id) {
        throw new Error("Erro interno no servidor!");
    }

    return {
        id,
        name,
        email,
        rf,
        cpf,
        situacaoUsuario,
        situacaoGrupo,
        visoes,
        perfis_por_sistema,
        groups,
        given_name,
        family_name,
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
        // Keycloak fields
        token.groups = user.groups;
        token.given_name = user.given_name;
        token.family_name = user.family_name;
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
        // Keycloak fields
        session.user.groups = token.groups;
        session.user.given_name = token.given_name;
        session.user.family_name = token.family_name;
    }
    return session;
}
