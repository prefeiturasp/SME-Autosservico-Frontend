import {
  fetchOrdemInscricaoStatusGeral,
  resolverParametros,
} from "@/actions/_helpers/intranetMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverParametros,
  fetchOrdemInscricaoStatusGeral,
  "Erro ao consultar o status geral de ordens de inscrição do Intranet",
);
