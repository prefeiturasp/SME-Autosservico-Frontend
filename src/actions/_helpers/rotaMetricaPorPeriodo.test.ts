import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/actions/_helpers/sgpMetricas", () => ({
  resolverPeriodo: () => ({ anoLetivo: 2026, bimestre: 2 }),
}));

import { auth } from "@/lib/auth";
import { criarRotaMetricaPorPeriodo } from "./rotaMetricaPorPeriodo";

const req = { url: "http://localhost/api/x" } as unknown as Request;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
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
