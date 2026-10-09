import {
  fetchSorteiosStatusGeral,
  resolverParametros,
} from "@/actions/_helpers/intranetMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverParametros,
  fetchSorteiosStatusGeral,
  "Erro ao consultar o status geral de sorteios do Intranet",
);
