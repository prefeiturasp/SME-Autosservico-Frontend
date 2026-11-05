import { fetchMetricasGipe } from "@/actions/_helpers/gipeMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  (searchParams) => searchParams,
  fetchMetricasGipe,
  "Erro ao consultar métricas do GIPE",
);
