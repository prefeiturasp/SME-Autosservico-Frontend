import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/bensFisicosMetricas", () => ({
  fetchMetricasBensFisicos: vi.fn(),
}));

import { auth } from "@/lib/auth";
import { fetchMetricasBensFisicos } from "@/actions/_helpers/bensFisicosMetricas";

import { GET } from "./metricas/route";

const mockedAuth = vi.mocked(auth);
const sessao = { user: { id: "1" } } as never;
const req = { url: "http://localhost/api/bens-fisicos/metricas" } as Request;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/bens-fisicos/metricas", () => {
  it("retorna 401 quando não autenticado", async () => {
    mockedAuth.mockResolvedValueOnce(null as never);

    const res = await GET(req);

    expect(res.status).toBe(401);
    expect(fetchMetricasBensFisicos).not.toHaveBeenCalled();
  });

  it("retorna 200 com o corpo do helper", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(fetchMetricasBensFisicos).mockResolvedValueOnce({ ok: true } as never);

    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("retorna 500 quando o helper lança (cache frio)", async () => {
    mockedAuth.mockResolvedValueOnce(sessao);
    vi.mocked(fetchMetricasBensFisicos).mockRejectedValueOnce(
      new Error("Métricas do Bens Físicos ainda indisponíveis"),
    );

    const res = await GET(req);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: "Métricas do Bens Físicos ainda indisponíveis",
    });
  });
});
