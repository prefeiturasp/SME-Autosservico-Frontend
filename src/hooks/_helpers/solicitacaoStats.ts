import type { StatItem } from "@/types/metricas";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";

export type SolicitacaoStatsOptions = {
  systemName: string;
  period?: AccessComparisonPeriod;
};

export function buildSolicitacaoStatItems(
  total: number,
  autorizadas: number,
  aguardando: number,
  negadas: number,
  canceladas: number,
): StatItem[] {
  return [
    { label: "Total", value: total, variant: "neutral" },
    { label: "Autorizadas", value: autorizadas, variant: "success" },
    { label: "Aguardando", value: aguardando, variant: "warning" },
    { label: "Negadas", value: negadas, variant: "danger" },
    { label: "Canceladas", value: canceladas, variant: "muted" },
  ];
}
