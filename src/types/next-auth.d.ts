import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Estende as interfaces existentes do NextAuth
declare module "next-auth" {
    interface User extends DefaultUser {
        rf: string; // Registro Funcional (RF)
        cpf?: string;
        situacaoUsuario?: number;
        situacaoGrupo?: number;
        visoes?: string[];
        perfis_por_sistema?: {
            sistema: number;
            perfis: string[];
        }[];
    }

    interface Session extends DefaultSession {
        user: {
            rf: string; // Registro Funcional (RF)
            cpf?: string;
            situacaoUsuario?: number;
            situacaoGrupo?: number;
            visoes?: string[];
            perfis_por_sistema?: {
                sistema: number;
                perfis: string[];
            }[];
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        rf: string; // Registro Funcional (RF)
        cpf?: string;
        situacaoUsuario?: number;
        situacaoGrupo?: number;
        visoes?: string[];
        perfis_por_sistema?: {
            sistema: number;
            perfis: string[];
        }[];
    }
}
