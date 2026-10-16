import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/serapMetricas", () => ({
  fetchProvas: vi.fn(),
  fetchUsuariosAcessoAtivo: vi.fn(),
}));
vi.mock("@/actions/_helpers/sgpMetricas", () => ({
  resolverPeriodo: (sp: URLSearchParams) => ({
    anoLetivo: Number(sp.get("ano_letivo")) || 2026,
    bimestre: Number(sp.get("bimestre")) || 2,
  }),
}));

import { auth } from "@/lib/auth";
import * as helpers from "@/actions/_helpers/serapMetricas";

import { GET as provas } from "./provas/route";
import { GET as acessoAtivo } from "./usuarios/acesso-ativo/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;

type Fetcher = "fetchProvas" | "fetchUsuariosAcessoAtivo";

const rotas: ReadonlyArray<{
  nome: string;
  GET: (request: Request) => Promise<Response>;
  fetcher: Fetcher;
}> = [
  { nome: "provas", GET: provas, fetcher: "fetchProvas" },
  {
    nome: "usuarios/acesso-ativo",
    GET: acessoAtivo,
    fetcher: "fetchUsuariosAcessoAtivo",
  },
];

const req = (nome: string) =>
  ({
    url: `http://localhost/api/serap/${nome}?ano_letivo=2025&bimestre=3`,
  }) as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

describe.each(rotas)("GET /api/serap/$nome", ({ nome, GET, fetcher }) => {
  it("retorna 401 quando não autenticado", async () => {
    mockedAuth.mockResolvedValueOnce(null as never);
    const res = await GET(req(nome));
    expect(res.status).toBe(401);
  });

  it("retorna 200 com o corpo do helper e repassa o período", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockResolvedValueOnce({ ok: true } as never);
    const res = await GET(req(nome));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(helpers[fetcher]).toHaveBeenCalledWith(2025, 3);
  });

  it("retorna 500 quando o helper lança", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(helpers[fetcher]).mockRejectedValueOnce(new Error("boom"));
    const res = await GET(req(nome));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("boom");
  });
});
