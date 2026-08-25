import type { StatItem } from "@/types/metricas";
import {
  useStatsByBimestre,
  type StatsByBimestreOptions,
} from "./_helpers/statsByBimestre";

const MOCK_ITEMS_BY_BIMESTRE: Record<string, StatItem[]> = {
  "2025-3": [
    { label: "Não iniciados", value: 10240, variant: "muted" },
    { label: "Processado com sucesso", value: 5120, variant: "success" },
    { label: "Processado com pendências", value: 4870, variant: "warning" },
    { label: "Processado com erro", value: 9210, variant: "danger" },
  ],
  "2025-4": [
    { label: "Não iniciados", value: 9560, variant: "muted" },
    { label: "Processado com sucesso", value: 6340, variant: "success" },
    { label: "Processado com pendências", value: 5680, variant: "warning" },
    { label: "Processado com erro", value: 10890, variant: "danger" },
  ],
  "2026-1": [
    { label: "Não iniciados", value: 8970, variant: "muted" },
    { label: "Processado com sucesso", value: 6980, variant: "success" },
    { label: "Processado com pendências", value: 6210, variant: "warning" },
    { label: "Processado com erro", value: 11640, variant: "danger" },
  ],
  "2026-2": [
    { label: "Não iniciados", value: 8398, variant: "muted" },
    { label: "Processado com sucesso", value: 7530, variant: "success" },
    { label: "Processado com pendências", value: 6853, variant: "warning" },
    { label: "Processado com erro", value: 12398, variant: "danger" },
  ],
};

export function useAcompanhamentoFechamento(options: StatsByBimestreOptions) {
  return useStatsByBimestre(
    "acompanhamento-fechamento",
    MOCK_ITEMS_BY_BIMESTRE,
    options,
  );
}
