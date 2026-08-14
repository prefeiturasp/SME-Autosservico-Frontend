import type { StatItem } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import {
  buildSolicitacaoStatItems,
  useSolicitacaoStats,
  type SolicitacaoStatsOptions,
} from "./_helpers/solicitacaoStats";

const MOCK_ITEMS_BY_PERIOD: Record<AccessComparisonPeriod, StatItem[]> = {
  dia: buildSolicitacaoStatItems(12, 8, 2, 1, 1),
  quinzena: buildSolicitacaoStatItems(58, 42, 9, 4, 3),
  mes: buildSolicitacaoStatItems(110, 82, 16, 7, 5),
  trimestre: buildSolicitacaoStatItems(310, 230, 45, 20, 15),
};

export function useSolicitacoesDietasEspeciais(options: SolicitacaoStatsOptions) {
  return useSolicitacaoStats(
    "solicitacoes-dietas-especiais",
    MOCK_ITEMS_BY_PERIOD,
    options,
  );
}
