import { fetchUsuariosAcessoAtivo } from "@/actions/_helpers/sgpMetricas";
import { criarRotaMetricaPorPeriodo } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

export const GET = criarRotaMetricaPorPeriodo(
  fetchUsuariosAcessoAtivo,
  "Erro ao consultar usuários com acesso ativo do SGP",
);
