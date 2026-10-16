"use client";

import { useMemo } from "react";
import { useAllowedSquads } from "@/hooks/useAllowedSquads";
import { getSistemasPorSquad } from "@/components/dashboard/SelectSistemas/getSistemasPorSquad";
import { AREAS_POR_COORDENADORIA } from "@/components/perfil/areasAcessoConfig";
import type { CoordenadoriaAcesso } from "@/types/coordenadoriaAcesso";

export function useAreasAcesso(): CoordenadoriaAcesso[] {
    const allowedSquads = useAllowedSquads();

    return useMemo(() => {
        return allowedSquads
            .map<CoordenadoriaAcesso | null>((sigla) => {
                const areas = AREAS_POR_COORDENADORIA[sigla.toUpperCase()];
                if (!areas || areas.length === 0) return null;

                const sistemas = getSistemasPorSquad(sigla);
                const descricao = sistemas.map((s) => s.nome).join(" - ");

                return {
                    sigla,
                    descricao: descricao || sigla,
                    areas,
                };
            })
            .filter((item): item is CoordenadoriaAcesso => item !== null);
    }, [allowedSquads]);
}
