import type { StatItem } from "@/types/metricas";
import {
  useSgpPeriodoQuery,
  type SgpPeriodoOptions,
} from "./_helpers/sgpPeriodoQuery";

export function useConselhoDeClasse(options: SgpPeriodoOptions) {
  return useSgpPeriodoQuery<StatItem[]>(
    "conselho-de-classe",
    "/api/sgp/conselho-de-classe",
    options,
  );
}
