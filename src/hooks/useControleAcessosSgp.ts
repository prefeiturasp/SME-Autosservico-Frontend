import type {
    ControleAcessosSgpResponse,
    GranularidadeAcessos,
    SerieAcessosSgpResponse,
} from "@/types/sgpControleAcessos";
import { useQuery } from "@tanstack/react-query";

const INTERVALO_ATUALIZACAO_MS = 60_000;
const INTERVALO_SEM_DADOS_MS = 5_000;

type Options = {
    systemName: string;
};

async function buscar<T>(rota: string, descricao: string): Promise<T> {
    const res = await fetch(rota);
    if (!res.ok) {
        throw new Error(`Falha ao buscar ${descricao} do SGP`);
    }
    return res.json();
}

export function useControleAcessosSgp({ systemName }: Options) {
    return useQuery<ControleAcessosSgpResponse>({
        queryKey: ["sgp-controle-acessos", systemName],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        refetchInterval: (query) =>
            query.state.data?.atualizadoEm
                ? INTERVALO_ATUALIZACAO_MS
                : INTERVALO_SEM_DADOS_MS,
        queryFn: () =>
            buscar("/api/sgp/controle-acessos", "o controle de acessos"),
    });
}

export function useSerieAcessosSgp({
    systemName,
    granularidade,
}: Options & { granularidade: GranularidadeAcessos }) {
    return useQuery<SerieAcessosSgpResponse>({
        queryKey: ["sgp-serie-acessos", systemName, granularidade],
        enabled: !!systemName,
        refetchOnWindowFocus: false,
        refetchInterval: (query) =>
            query.state.data?.pontos.length
                ? INTERVALO_ATUALIZACAO_MS
                : INTERVALO_SEM_DADOS_MS,
        queryFn: () =>
            buscar(
                `/api/sgp/controle-acessos/serie?granularidade=${granularidade}`,
                "a série de acessos",
            ),
    });
}
