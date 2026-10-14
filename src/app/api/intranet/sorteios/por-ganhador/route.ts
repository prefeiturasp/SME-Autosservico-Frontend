import {
  fetchSorteiosPorGanhador,
  resolverParametros,
} from "@/actions/_helpers/intranetMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverParametros,
  fetchSorteiosPorGanhador,
  "Erro ao consultar sorteios por ganhador do Intranet",
);
