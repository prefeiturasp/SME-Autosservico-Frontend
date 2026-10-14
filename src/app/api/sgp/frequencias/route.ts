import { fetchFrequencias } from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetricaPorPeriodo } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetricaPorPeriodo(
  fetchFrequencias,
  "Erro ao consultar frequências do SGP",
);
