import {
  fetchConselhoDeClasse,
  resolverFiltrosSgp,
} from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverFiltrosSgp,
  fetchConselhoDeClasse,
  "Erro ao consultar conselho de classe do SGP",
);
