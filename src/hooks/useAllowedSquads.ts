"use client";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

// Lê a variável de ambiente no build (Next.js substitui corretamente)
const AUTH_VERSION = process.env.NEXT_PUBLIC_AUTH_VERSION ?? "v1";

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

        // Debug: logar AUTH_VERSION e user
        console.log("[DEBUG] useAllowedSquads.ts AUTH_VERSION:", AUTH_VERSION);
        console.log("[DEBUG] useAllowedSquads.ts session.user:", user);

        // Retorna os grupos do usuário autenticado via Keycloak (v2)
        if (AUTH_VERSION === "v2") {
            if (!user.groups) return [];
            const result = Array.isArray(user.groups) ? user.groups : [];
            console.log("[DEBUG] allowedSquads (v2):", result);
            return result;
        }

        if (!user.perfis_por_sistema) return [];

        const allowedSquads: string[] = [];

        user.perfis_por_sistema.forEach((perfilSistema) => {
            if (perfilSistema.sistema === 1008) {
                allowedSquads.push(...perfilSistema.perfis);
            }
        });

        const result = Array.from(new Set(allowedSquads));
        console.log("[DEBUG] useAllowedSquads (v1):", result);
        return result;
    }, [session, status]);
}
