"use client";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

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
}

export function useAllowedSquads() {
    const { data: session } = useSession();

    return useMemo(() => {
        if (!session || !session.user) return [];

        const user = session.user as SessionUser;

        if (!user.perfis_por_sistema) return [];

        const allowedSquads: string[] = [];

        user.perfis_por_sistema.forEach((perfilSistema) => {
            if (perfilSistema.sistema === 1008) {
                allowedSquads.push(...perfilSistema.perfis);
            }
        });

        return Array.from(new Set(allowedSquads));
    }, [session]);
}
