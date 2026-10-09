import { fetchUsuariosAcessoAtivo } from "@/actions/_helpers/sigEscolaMetricas";
import { criarRotaMetrica } from "@/actions/_helpers/rotaMetricaPorPeriodo";

export const runtime = "nodejs";
export const revalidate = 0;

// Fotografia global: ignora a query string e lê o cenário padrão do BFF.
export const GET = criarRotaMetrica(
  fetchUsuariosAcessoAtivo,
  "Erro ao consultar usuários com acesso ativo do SIG-Escola",
);
