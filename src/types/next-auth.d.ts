import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Estende as interfaces existentes do NextAuth
declare module "next-auth" {
    interface User extends DefaultUser {
        rf: string;
        cpf?: string;
        situacaoUsuario?: number;
        situacaoGrupo?: number;
        visoes?: string[];
        perfis_por_sistema?: {
            sistema: number;
            perfis: string[];
        }[];
        groups?: string[];
        given_name?: string;
        family_name?: string;
        cargo?: string;
        coordenadoria?: string;
        ultimo_acesso?: string;
        tempo_sessao?: string;
    }

    interface Session extends DefaultSession {
        user: {
            rf: string;
            cpf?: string;
            situacaoUsuario?: number;
            situacaoGrupo?: number;
            visoes?: string[];
            perfis_por_sistema?: {
                sistema: number;
                perfis: string[];
            }[];
            groups?: string[];
            given_name?: string;
            family_name?: string;
            cargo?: string;
            coordenadoria?: string;
            ultimo_acesso?: string;
            tempo_sessao?: string;
        } & DefaultSession["user"];
        expires_at?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        rf: string;
        cpf?: string;
        situacaoUsuario?: number;
        situacaoGrupo?: number;
        visoes?: string[];
        perfis_por_sistema?: {
            sistema: number;
            perfis: string[];
        }[];
        groups?: string[];
        given_name?: string;
        family_name?: string;
        cargo?: string;
        coordenadoria?: string;
        ultimo_acesso?: string;
        tempo_sessao?: string;
        exp?: number;
    }
}
