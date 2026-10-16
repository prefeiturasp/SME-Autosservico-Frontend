import type { StatItem } from "@/types/metricas";
import {
  useSgpBimestreQuery,
  type SgpBimestreOptions,
} from "./_helpers/sgpBimestreQuery";

export function useAcompanhamentoFechamento(options: SgpBimestreOptions) {
  return useSgpBimestreQuery<StatItem[]>(
    "acompanhamento-fechamento",
    "/api/sgp/acompanhamento-fechamento",
    options,
  );
}
