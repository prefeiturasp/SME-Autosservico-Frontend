import { fetchPeriodosSgp } from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  () => undefined,
  fetchPeriodosSgp,
  "Erro ao consultar períodos do SGP",
);
