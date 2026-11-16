import {
  fetchSerieAcessos,
  resolverGranularidade,
} from "@/actions/_helpers/sgpControleAcessos";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  resolverGranularidade,
  fetchSerieAcessos,
  "Erro ao consultar a série de acessos do SGP",
);
