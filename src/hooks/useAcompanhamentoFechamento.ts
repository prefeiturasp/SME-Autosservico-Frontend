import type { AcompanhamentoFechamentoResponse } from "@/types/sgpMetricas";
import {
  useSgpPeriodoQuery,
  type SgpPeriodoOptions,
} from "./_helpers/sgpPeriodoQuery";

export function useAcompanhamentoFechamento(options: SgpPeriodoOptions) {
  return useSgpPeriodoQuery<AcompanhamentoFechamentoResponse>(
    "acompanhamento-fechamento",
    "/api/sgp/acompanhamento-fechamento",
    options,
  );
}
