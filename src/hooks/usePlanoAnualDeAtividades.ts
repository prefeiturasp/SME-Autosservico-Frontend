import type { SigEscolaMetricasResponse } from "@/types/metricas";
import {
  useSigEscolaMetricas,
  type SigEscolaQueryOptions,
} from "./_helpers/sigEscolaMetricasQuery";

const selecionar = (dados: SigEscolaMetricasResponse) => dados.planoAnual;

export function usePlanoAnualDeAtividades(options: SigEscolaQueryOptions) {
  return useSigEscolaMetricas(options, selecionar);
}
