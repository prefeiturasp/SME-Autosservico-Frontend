import { fetchUsuariosAcessoAtivoGipe } from "@/actions/_helpers/gipeMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

// Fotografia global: ignora a query string e lê o ano corrente do BFF.
export const GET = criarRotaMetrica(
  () => undefined,
  fetchUsuariosAcessoAtivoGipe,
  "Erro ao consultar usuários com acesso ativo do GIPE",
);
