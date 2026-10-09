import type { SigEscolaMetricasResponse } from "@/types/metricas";
import {
  useSigEscolaMetricas,
  type SigEscolaQueryOptions,
} from "./_helpers/sigEscolaMetricasQuery";

// KPI global: lê o mesmo contrato dos cards (uma requisição por filtro).
const selecionar = (dados: SigEscolaMetricasResponse) => dados.usuariosUnicos;

export function useUsuariosUnicosSigEscola(options: SigEscolaQueryOptions) {
  return useSigEscolaMetricas(options, selecionar);
}
