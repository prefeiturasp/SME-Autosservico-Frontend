import { fetchConselhoDeClasse } from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetricaPorPeriodo } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetricaPorPeriodo(
  fetchConselhoDeClasse,
  "Erro ao consultar conselho de classe do SGP",
);
