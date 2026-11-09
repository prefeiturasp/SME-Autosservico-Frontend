import {
  fetchAcompanhamentoFechamento,
  resolverFiltrosSgp,
} from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverFiltrosSgp,
  fetchAcompanhamentoFechamento,
  "Erro ao consultar acompanhamento de fechamento do SGP",
);
