import { fetchMetricasBensFisicos } from "@/actions/_helpers/bensFisicosMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  () => undefined,
  fetchMetricasBensFisicos,
  "Erro ao consultar métricas do Bens Físicos",
);
