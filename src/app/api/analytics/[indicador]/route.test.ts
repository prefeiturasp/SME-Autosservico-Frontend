import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/googleAnalytics/client.server", () => ({
  AnalyticsNaoConfiguradoError: class extends Error {},
}));
vi.mock("@/lib/googleAnalytics/indicadores.server", () => ({
  getActiveUsers: vi.fn(),
  getAverageSession: vi.fn(),
  getDeviceDistribution: vi.fn(),
  getPeakHours: vi.fn(),
  getPeakUsage: vi.fn(),
  getUsersByPage: vi.fn(),
}));

import { GET } from "./route";
import { auth } from "@/lib/auth";
import { AnalyticsNaoConfiguradoError } from "@/lib/googleAnalytics/client.server";
import { getActiveUsers } from "@/lib/googleAnalytics/indicadores.server";
import type { NextRequest } from "next/server";

const mockedAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>;
const mockedActiveUsers = vi.mocked(getActiveUsers);

function chamar(indicador: string, qs: string) {
  const req = { url: `http://localhost/api/analytics/${indicador}?${qs}` } as unknown as NextRequest;
  return GET(req, { params: { indicador } });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: "1" } });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/analytics/[indicador]", () => {
  it("exige sessão", async () => {
    mockedAuth.mockResolvedValueOnce(null);
    expect((await chamar("active-users", "systemName=SGP&period=hoje")).status).toBe(401);
  });

  it("valida indicador, sistema e período", async () => {
    expect((await chamar("inexistente", "systemName=SGP&period=hoje")).status).toBe(404);
    expect((await chamar("active-users", "period=hoje")).status).toBe(400);
    expect((await chamar("active-users", "systemName=SGP&period=ano")).status).toBe(400);
    expect(mockedActiveUsers).not.toHaveBeenCalled();
  });

  it("devolve o indicador do sistema e período pedidos", async () => {
    const resposta = { system: "SGP", activeCount: 1, averageCount: 1, differencePercentage: 0, trend: "on-average" as const };
    mockedActiveUsers.mockResolvedValueOnce(resposta);

    const res = await chamar("active-users", "systemName=SGP&period=7-dias");

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(resposta);
    expect(mockedActiveUsers).toHaveBeenCalledWith("SGP", "7-dias");
  });

  it("responde 404 quando o sistema não tem Analytics configurado", async () => {
    mockedActiveUsers.mockRejectedValueOnce(new AnalyticsNaoConfiguradoError("sem config"));
    const res = await chamar("active-users", "systemName=GIPE&period=hoje");
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "sem config" });
  });

  it("responde 502 sem expor o erro do Google", async () => {
    mockedActiveUsers.mockRejectedValueOnce(new Error("detalhe interno"));
    const res = await chamar("active-users", "systemName=SGP&period=hoje");
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({ error: "Erro ao consultar o Google Analytics" });
  });
});
