import {
  fetchOrdemInscricaoPorTipo,
  resolverParametros,
} from "@/actions/_helpers/intranetMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverParametros,
  fetchOrdemInscricaoPorTipo,
  "Erro ao consultar ordens de inscrição por tipo do Intranet",
);
