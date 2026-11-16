import { fetchControleAcessos } from "@/actions/_helpers/sgpControleAcessos";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetrica(
  () => undefined,
  fetchControleAcessos,
  "Erro ao consultar o controle de acessos do SGP",
);
