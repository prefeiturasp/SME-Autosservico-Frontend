import {
  fetchSorteiosPorTipo,
  resolverParametros,
} from "@/actions/_helpers/intranetMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverParametros,
  fetchSorteiosPorTipo,
  "Erro ao consultar sorteios por tipo do Intranet",
);
