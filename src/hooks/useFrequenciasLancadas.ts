import type { ProgressStatsResponse } from "@/types/metricas";
import {
  useSgpBimestreQuery,
  type SgpBimestreOptions,
} from "./_helpers/sgpBimestreQuery";

export function useFrequenciasLancadas(options: SgpBimestreOptions) {
  return useSgpBimestreQuery<ProgressStatsResponse>(
    "frequencias-lancadas",
    "/api/sgp/frequencias",
    options,
  );
}
