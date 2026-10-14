import type { ProvasResponse } from "@/types/metricas";
import {
  useSgpBimestreQuery,
  type SgpBimestreOptions,
} from "./_helpers/sgpBimestreQuery";

// O bloco "Provas" do SERAp usa o mesmo seletor ANO-BIMESTRE do SGP.
export function useProvas(options: SgpBimestreOptions) {
  return useSgpBimestreQuery<ProvasResponse>(
    "provas",
    "/api/serap/provas",
    options,
  );
}
