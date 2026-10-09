import { fetchMetricasSigEscola } from "@/actions/_helpers/sigEscolaMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  fetchMetricasSigEscola,
  "Erro ao consultar métricas do SIG-Escola",
);
