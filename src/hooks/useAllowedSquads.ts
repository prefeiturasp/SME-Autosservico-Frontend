"use client";
import { useMemo } from "react";
import { useSession } from "next-auth/react";


// Função utilitária para ler a env dinamicamente (testável)
function getAuthVersion() {
    return process.env.NEXT_PUBLIC_AUTH_VERSION ?? "v1";
}

interface PerfilPorSistema {
    sistema: number;
    perfis: string[];
}

interface SessionUser {
    name?: string;
    email?: string;
    id?: string;
    rf?: string;
    cpf?: string;
    situacaoUsuario?: number;
    situacaoGrupo?: number;
    visoes?: string[];
    perfis_por_sistema?: PerfilPorSistema[];
    groups?: string[]; // V2 Keycloak
}

export function useAllowedSquads() {
    const { data: session, status } = useSession();

    return useMemo(() => {
        // Evita executar se ainda está carregando
        if (status === "loading") return [];

        if (!session?.user) return [];

        const user = session.user as SessionUser;

        // Retorna os grupos do usuário autenticado via Keycloak (v2)
        if (getAuthVersion() === "v2") {
            if (!user.groups) return [];
            return Array.isArray(user.groups) ? user.groups : [];
        }

        if (!user.perfis_por_sistema) return [];

        const allowedSquads: string[] = [];

        user.perfis_por_sistema.forEach((perfilSistema) => {
            if (perfilSistema.sistema === 1008) {
                allowedSquads.push(...perfilSistema.perfis);
            }
        });

        return Array.from(new Set(allowedSquads));
    }, [session, status]);
}
