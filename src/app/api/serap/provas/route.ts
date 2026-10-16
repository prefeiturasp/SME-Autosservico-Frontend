import { fetchProvas } from "@/actions/_helpers/serapMetricas";
import { criarRotaMetricaPorPeriodo } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetricaPorPeriodo(
  fetchProvas,
  "Erro ao consultar provas do SERAp",
);
