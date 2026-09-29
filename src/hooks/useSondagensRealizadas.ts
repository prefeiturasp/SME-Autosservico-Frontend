import type { ProgressStatsResponse } from "@/types/metricas";
import {
  useSgpBimestreQuery,
  type SgpBimestreOptions,
} from "./_helpers/sgpBimestreQuery";

export function useSondagensRealizadas(options: SgpBimestreOptions) {
  return useSgpBimestreQuery<ProgressStatsResponse>(
    "sondagens-realizadas",
    "/api/sgp/sondagens",
    options,
  );
}
