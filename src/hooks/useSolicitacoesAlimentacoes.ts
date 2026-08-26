import type { StatItem } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import {
  buildSolicitacaoStatItems,
  useSolicitacaoStats,
  type SolicitacaoStatsOptions,
} from "./_helpers/solicitacaoStats";

const MOCK_ITEMS_BY_PERIOD: Record<AccessComparisonPeriod, StatItem[]> = {
  dia: buildSolicitacaoStatItems(18, 14, 2, 1, 1),
  quinzena: buildSolicitacaoStatItems(95, 74, 11, 6, 4),
  mes: buildSolicitacaoStatItems(175, 138, 20, 10, 7),
  trimestre: buildSolicitacaoStatItems(360, 285, 32, 14, 8),
};

export function useSolicitacoesAlimentacoes(options: SolicitacaoStatsOptions) {
  return useSolicitacaoStats(
    "solicitacoes-alimentacoes",
    MOCK_ITEMS_BY_PERIOD,
    options,
  );
}
