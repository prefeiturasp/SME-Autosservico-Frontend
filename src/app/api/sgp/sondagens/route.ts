import { fetchSondagens } from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetricaPorPeriodo } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetricaPorPeriodo(
  fetchSondagens,
  "Erro ao consultar sondagens do SGP",
);
