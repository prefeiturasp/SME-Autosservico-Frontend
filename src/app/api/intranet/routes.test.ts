vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/intranetMetricas", () => ({
  fetchSorteiosStatusGeral: vi.fn(),
  fetchSorteiosPorTipo: vi.fn(),
  fetchSorteiosPorGanhador: vi.fn(),
  fetchSorteiosPorDre: vi.fn(),
  fetchOrdemInscricaoStatusGeral: vi.fn(),
  fetchOrdemInscricaoPorTipo: vi.fn(),
  fetchOrdemInscricaoPorGanhador: vi.fn(),
  fetchOrdemInscricaoPorDre: vi.fn(),
  fetchOportunidades: vi.fn(),
  resolverParametros: (sp: URLSearchParams) => ({
    periodo: sp.get("periodo") ?? "geral",
    mes: sp.get("mes"),
  }),
}));

import { auth } from "@/lib/auth";
import * as helpers from "@/actions/_helpers/intranetMetricas";

import { GET as sorteiosStatusGeral } from "./sorteios/status-geral/route";
import { GET as sorteiosPorTipo } from "./sorteios/por-tipo/route";
import { GET as sorteiosPorGanhador } from "./sorteios/por-ganhador/route";
import { GET as sorteiosPorDre } from "./sorteios/por-dre/route";
import { GET as ordemStatusGeral } from "./ordem-inscricao/status-geral/route";
import { GET as ordemPorTipo } from "./ordem-inscricao/por-tipo/route";
import { GET as ordemPorGanhador } from "./ordem-inscricao/por-ganhador/route";
import { GET as ordemPorDre } from "./ordem-inscricao/por-dre/route";
import { GET as oportunidades } from "./oportunidades/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;

type Fetcher =
  | "fetchSorteiosStatusGeral"
  | "fetchSorteiosPorTipo"
  | "fetchSorteiosPorGanhador"
  | "fetchSorteiosPorDre"
  | "fetchOrdemInscricaoStatusGeral"
  | "fetchOrdemInscricaoPorTipo"
  | "fetchOrdemInscricaoPorGanhador"
  | "fetchOrdemInscricaoPorDre"
  | "fetchOportunidades";

const rotas: ReadonlyArray<{
  nome: string;
  GET: (request: Request) => Promise<Response>;
  fetcher: Fetcher;
}> = [
  { nome: "sorteios/status-geral", GET: sorteiosStatusGeral, fetcher: "fetchSorteiosStatusGeral" },
  { nome: "sorteios/por-tipo", GET: sorteiosPorTipo, fetcher: "fetchSorteiosPorTipo" },
  { nome: "sorteios/por-ganhador", GET: sorteiosPorGanhador, fetcher: "fetchSorteiosPorGanhador" },
  { nome: "sorteios/por-dre", GET: sorteiosPorDre, fetcher: "fetchSorteiosPorDre" },
  { nome: "ordem-inscricao/status-geral", GET: ordemStatusGeral, fetcher: "fetchOrdemInscricaoStatusGeral" },
  { nome: "ordem-inscricao/por-tipo", GET: ordemPorTipo, fetcher: "fetchOrdemInscricaoPorTipo" },
  { nome: "ordem-inscricao/por-ganhador", GET: ordemPorGanhador, fetcher: "fetchOrdemInscricaoPorGanhador" },
  { nome: "ordem-inscricao/por-dre", GET: ordemPorDre, fetcher: "fetchOrdemInscricaoPorDre" },
  { nome: "oportunidades", GET: oportunidades, fetcher: "fetchOportunidades" },
];

const req = (nome: string) =>
  ({
    url: `http://localhost/api/intranet/${nome}?periodo=mes&mes=2026-03`,
  }) as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

describe.each(rotas)("GET /api/intranet/$nome", ({ nome, GET, fetcher }) => {
  it("retorna 401 quando não autenticado", async () => {
    mockedAuth.mockResolvedValueOnce(null as never);
    const res = await GET(req(nome));
    expect(res.status).toBe(401);
    expect(helpers[fetcher]).not.toHaveBeenCalled();
  });

  it("retorna 200 com o corpo do helper, repassando periodo/mes", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockResolvedValueOnce({ ok: true } as never);
    const res = await GET(req(nome));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(helpers[fetcher]).toHaveBeenCalledWith({
      periodo: "mes",
      mes: "2026-03",
    });
  });

  it("retorna 500 quando o helper lança", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockRejectedValueOnce(new Error("boom"));
    const res = await GET(req(nome));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("boom");
  });
});
