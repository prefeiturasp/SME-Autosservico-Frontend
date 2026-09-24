import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/sigpaeMetricas", () => ({
  fetchMedicoesIniciais: vi.fn(),
  fetchProdutosHomologados: vi.fn(),
  fetchEmpresasTerceirizadas: vi.fn(),
  fetchSolicitacoesDietasEspeciais: vi.fn(),
  fetchSolicitacoesAlimentacoes: vi.fn(),
  fetchCronogramasEntregas: vi.fn(),
  fetchFichasTecnicasProdutos: vi.fn(),
  fetchFornecedoresDistribuidores: vi.fn(),
  fetchLayoutsEmbalagens: vi.fn(),
  fetchComparativoAcessos: vi.fn(),
  fetchUsuariosAcessoAtivo: vi.fn(),
  fetchUsuariosUnicosPorDia: vi.fn(),
  fetchAcessosHoje: vi.fn(),
  fetchUsuariosPorTipoPerfil: vi.fn(),
}));

import { auth } from "@/lib/auth";
import * as helpers from "@/actions/_helpers/sigpaeMetricas";

import { GET as alimentacoes } from "./alimentacoes/route";
import { GET as comparativo } from "./comparativo-acessos/route";
import { GET as cronogramas } from "./cronogramas-entregas/route";
import { GET as dietas } from "./dietas-especiais/route";
import { GET as empresas } from "./empresas-terceirizadas/route";
import { GET as fichas } from "./fichas-tecnicas-produtos/route";
import { GET as fornecedores } from "./fornecedores-distribuidores/route";
import { GET as layouts } from "./layouts-embalagens/route";
import { GET as medicoes } from "./medicoes-iniciais/route";
import { GET as produtos } from "./produtos-homologados/route";
import { GET as acessoAtivo } from "./usuarios/acesso-ativo/route";
import { GET as acessosHoje } from "./usuarios/acessos-hoje/route";
import { GET as porTipoPerfil } from "./usuarios/por-tipo-perfil/route";
import { GET as unicosPorDia } from "./usuarios/unicos-por-dia/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;

type Fetcher = keyof typeof helpers;

const rotas: ReadonlyArray<{
  nome: string;
  GET: () => Promise<Response>;
  fetcher: Fetcher;
}> = [
  { nome: "alimentacoes", GET: alimentacoes, fetcher: "fetchSolicitacoesAlimentacoes" },
  { nome: "comparativo-acessos", GET: comparativo, fetcher: "fetchComparativoAcessos" },
  { nome: "cronogramas-entregas", GET: cronogramas, fetcher: "fetchCronogramasEntregas" },
  { nome: "dietas-especiais", GET: dietas, fetcher: "fetchSolicitacoesDietasEspeciais" },
  { nome: "empresas-terceirizadas", GET: empresas, fetcher: "fetchEmpresasTerceirizadas" },
  { nome: "fichas-tecnicas-produtos", GET: fichas, fetcher: "fetchFichasTecnicasProdutos" },
  { nome: "fornecedores-distribuidores", GET: fornecedores, fetcher: "fetchFornecedoresDistribuidores" },
  { nome: "layouts-embalagens", GET: layouts, fetcher: "fetchLayoutsEmbalagens" },
  { nome: "medicoes-iniciais", GET: medicoes, fetcher: "fetchMedicoesIniciais" },
  { nome: "produtos-homologados", GET: produtos, fetcher: "fetchProdutosHomologados" },
  { nome: "usuarios/acesso-ativo", GET: acessoAtivo, fetcher: "fetchUsuariosAcessoAtivo" },
  { nome: "usuarios/acessos-hoje", GET: acessosHoje, fetcher: "fetchAcessosHoje" },
  { nome: "usuarios/por-tipo-perfil", GET: porTipoPerfil, fetcher: "fetchUsuariosPorTipoPerfil" },
  { nome: "usuarios/unicos-por-dia", GET: unicosPorDia, fetcher: "fetchUsuariosUnicosPorDia" },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe.each(rotas)("GET /api/sigpae/$nome", ({ GET, fetcher }) => {
  it("retorna 401 quando não autenticado", async () => {
    mockedAuth.mockResolvedValueOnce(null as never);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("retorna 200 com o corpo do helper", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockResolvedValueOnce({ ok: true } as never);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("retorna 500 quando o helper lança", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockRejectedValueOnce(new Error("boom"));
    const res = await GET();
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("boom");
  });
});
