import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("axios", () => ({
  default: { create: vi.fn(() => ({ get })) },
}));

import { bffGet } from "./bff.server";

beforeEach(() => {
  get.mockReset();
});

describe("bffGet", () => {
  it("devolve o corpo da resposta do BFF no caminho pedido", async () => {
    get.mockResolvedValue({ data: { total: 12 } });

    const res = await bffGet<{ total: number }>("/api/v1/sigpae/metricas/");

    expect(res).toEqual({ total: 12 });
    expect(get).toHaveBeenCalledWith("/api/v1/sigpae/metricas/");
  });

  it("propaga erro quando a requisição falha", async () => {
    get.mockRejectedValue(new Error("500"));

    await expect(bffGet("/x")).rejects.toThrow("500");
  });
});
