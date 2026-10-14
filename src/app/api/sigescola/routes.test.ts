import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/sigEscolaMetricas", () => ({
  fetchMetricasSigEscola: vi.fn(),
  fetchUsuariosAcessoAtivo: vi.fn(),
}));

import { auth } from "@/lib/auth";
import * as helpers from "@/actions/_helpers/sigEscolaMetricas";

import { GET as metricas } from "./metricas/route";
import { GET as acessoAtivo } from "./usuarios/acesso-ativo/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;

type Fetcher = "fetchMetricasSigEscola" | "fetchUsuariosAcessoAtivo";

const rotas: ReadonlyArray<{
  nome: string;
  GET: (request: Request) => Promise<Response>;
  fetcher: Fetcher;
}> = [
  { nome: "metricas", GET: metricas, fetcher: "fetchMetricasSigEscola" },
  {
    nome: "usuarios/acesso-ativo",
    GET: acessoAtivo,
    fetcher: "fetchUsuariosAcessoAtivo",
  },
];

const req = (nome: string) =>
  ({
    url: `http://localhost/api/sigescola/${nome}?dre=108100`,
  }) as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

describe.each(rotas)("GET /api/sigescola/$nome", ({ nome, GET, fetcher }) => {
  it("retorna 401 quando não autenticado", async () => {
    mockedAuth.mockResolvedValueOnce(null as never);
    const res = await GET(req(nome));
    expect(res.status).toBe(401);
  });

  it("retorna 200 com o corpo do helper", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockResolvedValueOnce({ ok: true } as never);
    const res = await GET(req(nome));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("retorna 500 quando o helper lança (cache frio)", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockRejectedValueOnce(
      new Error("Métricas do SIG-Escola ainda indisponíveis"),
    );
    const res = await GET(req(nome));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe(
      "Métricas do SIG-Escola ainda indisponíveis",
    );
  });
});

describe("GET /api/sigescola/metricas", () => {
  it("repassa a query string da tela ao helper", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers.fetchMetricasSigEscola).mockResolvedValueOnce(
      {} as never,
    );

    await metricas(req("metricas"));

    const params = vi.mocked(helpers.fetchMetricasSigEscola).mock.calls[0][0];
    expect(params.get("dre")).toBe("108100");
  });
});
