import {
  fetchOrdemInscricaoPorGanhador,
  resolverParametros,
} from "@/actions/_helpers/intranetMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverParametros,
  fetchOrdemInscricaoPorGanhador,
  "Erro ao consultar ordens de inscrição por ganhador do Intranet",
);
