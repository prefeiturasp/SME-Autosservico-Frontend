import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchAnalytics } from "./analytics";

afterEach(() => vi.unstubAllGlobals());

describe("fetchAnalytics", () => {
  it("consulta a rota do indicador com sistema e período", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ a: 1 }) });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchAnalytics("active-users", "SGP", "7-dias")).resolves.toEqual({ a: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/analytics/active-users?systemName=SGP&period=7-dias",
      { cache: "no-store" },
    );
  });

  it("lança erro quando a rota falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(fetchAnalytics("peak-hours", "SGP", "hoje")).rejects.toThrow(
      "Falha ao buscar dados do Google Analytics",
    );
  });
});
