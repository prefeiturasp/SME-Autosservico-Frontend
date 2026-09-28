import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/sgpMetricas", () => ({
  fetchFrequencias: vi.fn(),
  fetchSondagens: vi.fn(),
  fetchAcompanhamentoFechamento: vi.fn(),
  fetchConselhoDeClasse: vi.fn(),
  fetchUsuariosAcessoAtivo: vi.fn(),
  resolverPeriodo: (sp: URLSearchParams) => ({
    anoLetivo: Number(sp.get("ano_letivo")) || 2026,
    bimestre: Number(sp.get("bimestre")) || 2,
  }),
}));

import { auth } from "@/lib/auth";
import * as helpers from "@/actions/_helpers/sgpMetricas";

import { GET as frequencias } from "./frequencias/route";
import { GET as sondagens } from "./sondagens/route";
import { GET as fechamento } from "./acompanhamento-fechamento/route";
import { GET as conselho } from "./conselho-de-classe/route";
import { GET as acessoAtivo } from "./usuarios/acesso-ativo/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;

type Fetcher =
  | "fetchFrequencias"
  | "fetchSondagens"
  | "fetchAcompanhamentoFechamento"
  | "fetchConselhoDeClasse"
  | "fetchUsuariosAcessoAtivo";

const rotas: ReadonlyArray<{
  nome: string;
  GET: (request: Request) => Promise<Response>;
  fetcher: Fetcher;
}> = [
  { nome: "frequencias", GET: frequencias, fetcher: "fetchFrequencias" },
  { nome: "sondagens", GET: sondagens, fetcher: "fetchSondagens" },
  {
    nome: "acompanhamento-fechamento",
    GET: fechamento,
    fetcher: "fetchAcompanhamentoFechamento",
  },
  {
    nome: "conselho-de-classe",
    GET: conselho,
    fetcher: "fetchConselhoDeClasse",
  },
  {
    nome: "usuarios/acesso-ativo",
    GET: acessoAtivo,
    fetcher: "fetchUsuariosAcessoAtivo",
  },
];

const req = (nome: string) =>
  ({
    url: `http://localhost/api/sgp/${nome}?ano_letivo=2026&bimestre=2`,
  }) as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

describe.each(rotas)("GET /api/sgp/$nome", ({ nome, GET, fetcher }) => {
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

  it("retorna 500 quando o helper lança", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockRejectedValueOnce(new Error("boom"));
    const res = await GET(req(nome));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("boom");
  });
});
