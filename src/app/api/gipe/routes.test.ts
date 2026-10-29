import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/gipeMetricas", () => ({
  fetchMetricasGipe: vi.fn(),
  fetchUsuariosAcessoAtivoGipe: vi.fn(),
}));

import { auth } from "@/lib/auth";
import * as helpers from "@/actions/_helpers/gipeMetricas";

import { GET as metricas } from "./metricas/route";
import { GET as acessoAtivo } from "./usuarios/acesso-ativo/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;

type Fetcher = "fetchMetricasGipe" | "fetchUsuariosAcessoAtivoGipe";

const rotas: ReadonlyArray<{
  nome: string;
  GET: (request: Request) => Promise<Response>;
  fetcher: Fetcher;
}> = [
  { nome: "metricas", GET: metricas, fetcher: "fetchMetricasGipe" },
  {
    nome: "usuarios/acesso-ativo",
    GET: acessoAtivo,
    fetcher: "fetchUsuariosAcessoAtivoGipe",
  },
];

const req = (nome: string) =>
  ({
    url: `http://localhost/api/gipe/${nome}?ano_letivo=2025`,
  }) as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

describe.each(rotas)("GET /api/gipe/$nome", ({ nome, GET, fetcher }) => {
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
      new Error("Métricas do GIPE ainda indisponíveis"),
    );
    const res = await GET(req(nome));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe(
      "Métricas do GIPE ainda indisponíveis",
    );
  });
});

describe("GET /api/gipe/metricas", () => {
  it("repassa a query string da tela ao helper", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers.fetchMetricasGipe).mockResolvedValueOnce(
      {} as never,
    );

    await metricas(req("metricas"));

    const params = vi.mocked(helpers.fetchMetricasGipe).mock.calls[0][0];
    expect(params.get("ano_letivo")).toBe("2025");
  });
});
