import type { SigEscolaMetricasResponse } from "@/types/metricas";
import {
  useSigEscolaMetricas,
  type SigEscolaQueryOptions,
} from "./_helpers/sigEscolaMetricasQuery";

const selecionar = (dados: SigEscolaMetricasResponse) =>
  dados.prestacaoDeContas;

export function usePrestacaoDeContas(options: SigEscolaQueryOptions) {
  return useSigEscolaMetricas(options, selecionar);
}
