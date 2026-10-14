import {
  useSolicitacoesPorPeriodo,
  type SolicitacaoStatsOptions,
} from "./_helpers/solicitacaoStats";

export function useSolicitacoesAlimentacoes(options: SolicitacaoStatsOptions) {
  return useSolicitacoesPorPeriodo(
    "solicitacoes-alimentacoes",
    "/api/sigpae/alimentacoes",
    "Falha ao buscar as solicitações de alimentações",
    options,
  );
}
