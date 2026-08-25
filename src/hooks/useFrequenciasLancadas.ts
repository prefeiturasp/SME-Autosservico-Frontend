import type { ProgressStatsResponse } from "@/types/metricas";
import {
  useProgressStatsByBimestre,
  type ProgressStatsByBimestreOptions,
} from "./_helpers/progressStatsByBimestre";

const MOCK_RESPONSE_BY_BIMESTRE: Record<string, ProgressStatsResponse> = {
  "2025-3": {
    items: [
      { label: "Lançadas", value: 12580, variant: "neutral" },
      { label: "Esperadas", value: 15200, variant: "muted" },
    ],
    progressPercentage: 82.8,
  },
  "2025-4": {
    items: [
      { label: "Lançadas", value: 15940, variant: "neutral" },
      { label: "Esperadas", value: 17100, variant: "muted" },
    ],
    progressPercentage: 93.2,
  },
  "2026-1": {
    items: [
      { label: "Lançadas", value: 16870, variant: "neutral" },
      { label: "Esperadas", value: 19430, variant: "muted" },
    ],
    progressPercentage: 86.8,
  },
  "2026-2": {
    items: [
      { label: "Lançadas", value: 18432, variant: "neutral" },
      { label: "Esperadas", value: 21760, variant: "muted" },
    ],
    progressPercentage: 122.3,
  },
};

export function useFrequenciasLancadas(options: ProgressStatsByBimestreOptions) {
  return useProgressStatsByBimestre(
    "frequencias-lancadas",
    MOCK_RESPONSE_BY_BIMESTRE,
    options,
  );
}
