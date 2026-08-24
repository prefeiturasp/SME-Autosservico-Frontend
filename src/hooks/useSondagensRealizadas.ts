import type { ProgressStatsResponse } from "@/types/metricas";
import {
  useProgressStatsByBimestre,
  type ProgressStatsByBimestreOptions,
} from "./_helpers/progressStatsByBimestre";

const MOCK_RESPONSE_BY_BIMESTRE: Record<string, ProgressStatsResponse> = {
  "2025-3": {
    items: [
      { label: "Sondagens realizadas", value: 780, variant: "neutral" },
      { label: "Sondagens esperadas", value: 2200, variant: "muted" },
    ],
    progressPercentage: 35.5,
  },
  "2025-4": {
    items: [
      { label: "Sondagens realizadas", value: 980, variant: "neutral" },
      { label: "Sondagens esperadas", value: 2350, variant: "muted" },
    ],
    progressPercentage: 41.7,
  },
  "2026-1": {
    items: [
      { label: "Sondagens realizadas", value: 1090, variant: "neutral" },
      { label: "Sondagens esperadas", value: 2520, variant: "muted" },
    ],
    progressPercentage: 43.3,
  },
  "2026-2": {
    items: [
      { label: "Sondagens realizadas", value: 1243, variant: "neutral" },
      { label: "Sondagens esperadas", value: 2683, variant: "muted" },
    ],
    progressPercentage: 62.3,
  },
};

export function useSondagensRealizadas(options: ProgressStatsByBimestreOptions) {
  return useProgressStatsByBimestre(
    "sondagens-realizadas",
    MOCK_RESPONSE_BY_BIMESTRE,
    options,
  );
}
