import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/sgpMetricas", () => ({
  resolverPeriodo: () => ({ anoLetivo: 2026, bimestre: 2 }),
}));

import { auth } from "@/lib/auth";
import {
  criarRotaMetrica,
  criarRotaMetricaPorPeriodo,
} from "./rotaMetricaPorPeriodo";

const req = { url: "http://localhost/api/x" } as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
});

describe("criarRotaMetrica", () => {
  it("retorna 401 sem sessão e não chama o fetcher", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as never);
    const fetcher = vi.fn();

    const res = await criarRotaMetrica(fetcher, "Erro padrão")(req);

    expect(res.status).toBe(401);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("entrega a query string ao fetcher e devolve o corpo", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    const GET = criarRotaMetrica(fetcher, "Erro padrão");

    const res = await GET({
      url: "http://localhost/api/x?dre=108100",
    } as unknown as Request);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetcher.mock.calls[0][0].get("dre")).toBe("108100");
  });

  it("retorna 500 com a mensagem do erro", async () => {
    const GET = criarRotaMetrica(
      () => Promise.reject(new Error("boom")),
      "Erro padrão",
    );

    const res = await GET(req);

    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("boom");
  });
});

describe("criarRotaMetricaPorPeriodo", () => {
  it("usa a mensagem padrão quando o erro não é um objeto", async () => {
    const GET = criarRotaMetricaPorPeriodo(
      () => Promise.reject("falhou"),
      "Erro padrão",
    );

    const res = await GET(req);

    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Erro padrão");
  });

  it("usa a mensagem padrão quando o erro tem message indefinida", async () => {
    const GET = criarRotaMetricaPorPeriodo(
      () => Promise.reject({ message: undefined }),
      "Erro padrão",
    );

    const res = await GET(req);

    expect((await res.json()).error).toBe("Erro padrão");
  });

  it("repassa o período resolvido ao fetcher", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    const GET = criarRotaMetricaPorPeriodo(fetcher, "Erro padrão");

    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(fetcher).toHaveBeenCalledWith(2026, 2);
  });
});
