import {
  useSolicitacoesPorPeriodo,
  type SolicitacaoStatsOptions,
} from "./_helpers/solicitacaoStats";

export function useSolicitacoesDietasEspeciais(options: SolicitacaoStatsOptions) {
  return useSolicitacoesPorPeriodo(
    "solicitacoes-dietas-especiais",
    "/api/sigpae/dietas-especiais",
    "Falha ao buscar as solicitações de dietas especiais",
    options,
  );
}
