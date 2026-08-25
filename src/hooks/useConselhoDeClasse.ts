import type { StatItem } from "@/types/metricas";
import {
  useStatsByBimestre,
  type StatsByBimestreOptions,
} from "./_helpers/statsByBimestre";

const MOCK_ITEMS_BY_BIMESTRE: Record<string, StatItem[]> = {
  "2025-3": [
    { label: "Não iniciados", value: 340, variant: "muted" },
    { label: "Em andamento", value: 290, variant: "neutral" },
    { label: "Processado com sucesso", value: 1120, variant: "success" },
  ],
  "2025-4": [
    { label: "Não iniciados", value: 285, variant: "muted" },
    { label: "Em andamento", value: 330, variant: "neutral" },
    { label: "Processado com sucesso", value: 1390, variant: "success" },
  ],
  "2026-1": [
    { label: "Não iniciados", value: 250, variant: "muted" },
    { label: "Em andamento", value: 360, variant: "neutral" },
    { label: "Processado com sucesso", value: 1640, variant: "success" },
  ],
  "2026-2": [
    { label: "Não iniciados", value: 204, variant: "muted" },
    { label: "Em andamento", value: 387, variant: "neutral" },
    { label: "Processado com sucesso", value: 1889, variant: "success" },
  ],
};

export function useConselhoDeClasse(options: StatsByBimestreOptions) {
  return useStatsByBimestre("conselho-de-classe", MOCK_ITEMS_BY_BIMESTRE, options);
}
