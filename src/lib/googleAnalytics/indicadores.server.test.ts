import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./client.server", () => ({
  runReport: vi.fn(),
  runRealtimeReport: vi.fn(),
}));

import { runRealtimeReport, runReport } from "./client.server";
import {
  getActiveUsers,
  getAverageSession,
  getDeviceDistribution,
  getPeakHours,
  getPeakUsage,
  getUsersByPage,
} from "./indicadores.server";

const report = vi.mocked(runReport);
const realtime = vi.mocked(runRealtimeReport);
const row = (dimensions: string[], ...metrics: number[]) => ({ dimensions, metrics });

beforeEach(() => {
  report.mockReset();
  realtime.mockReset();
  vi.useFakeTimers();
  // 14h em São Paulo
  vi.setSystemTime(new Date("2026-11-16T17:30:00Z"));
});

afterEach(() => vi.useRealTimers());

describe("getActiveUsers", () => {
  it("compara o período com a média dos 3 períodos anteriores", async () => {
    report.mockResolvedValueOnce([
      row(["janela_0"], 120),
      row(["janela_1"], 100),
      row(["janela_2"], 90),
      row(["janela_3"], 110),
    ]);

    await expect(getActiveUsers("SGP", "7-dias")).resolves.toEqual({
      system: "SGP",
      activeCount: 120,
      averageCount: 100,
      trend: "above",
      differencePercentage: 20,
    });
    expect(report.mock.calls[0][1].dateRanges).toEqual([
      { startDate: "7daysAgo", endDate: "1daysAgo", name: "janela_0" },
      { startDate: "14daysAgo", endDate: "8daysAgo", name: "janela_1" },
      { startDate: "21daysAgo", endDate: "15daysAgo", name: "janela_2" },
      { startDate: "28daysAgo", endDate: "22daysAgo", name: "janela_3" },
    ]);
  });

  it("em Hoje usa o tempo real contra a mesma hora das semanas anteriores", async () => {
    realtime.mockResolvedValueOnce([row([], 50)]);
    report.mockResolvedValueOnce([row(["semana_7"], 100), row(["semana_14"], 100)]);

    const resposta = await getActiveUsers("SGP", "hoje");

    expect(resposta).toMatchObject({
      activeCount: 50,
      averageCount: 100,
      trend: "below",
      differencePercentage: 50,
    });
    expect(report.mock.calls[0][1].dimensionFilter).toEqual({
      filter: { fieldName: "hour", stringFilter: { value: "14" } },
    });
  });

  it("fica na média quando não há referência nem dados", async () => {
    realtime.mockResolvedValueOnce([]);
    report.mockResolvedValueOnce([]);

    await expect(getActiveUsers("SGP", "hoje")).resolves.toMatchObject({
      activeCount: 0,
      averageCount: 0,
      trend: "on-average",
      differencePercentage: 0,
    });
  });
});

describe("getAverageSession", () => {
  it("compara a sessão média com o intervalo de referência", async () => {
    report.mockResolvedValueOnce([row(["janela_0"], 800.4), row(["referencia"], 790.2)]);

    await expect(getAverageSession("SGP", "30-dias")).resolves.toEqual({
      system: "SGP",
      currentSeconds: 800,
      averageSeconds: 790,
      trend: "on-average",
    });
    expect((report.mock.calls[0][1].dateRanges as unknown[])[1]).toEqual({
      startDate: "120daysAgo",
      endDate: "31daysAgo",
      name: "referencia",
    });
  });
});

describe("acessos por hora", () => {
  it("monta as 24 horas, ignora linhas (other) e aponta o pico", async () => {
    report.mockResolvedValue([
      row(["11", "desktop"], 30),
      row(["11", "mobile"], 5),
      row(["14", "desktop"], 20),
      row(["(other)", "(other)"], 99),
      row(["9", "smart tv"], 99),
    ]);

    const horas = await getPeakHours("SGP", "7-dias");

    expect(horas.peakHour).toBe("11h");
    expect(horas.data).toHaveLength(24);
    expect(horas.data[11]).toEqual({ hour: "11h", desktop: 30, mobile: 5, tablet: 0, total: 35 });
    expect(horas.data[9].total).toBe(0);
    await expect(getPeakUsage("SGP", "7-dias")).resolves.toEqual({
      system: "SGP",
      peakHour: 11,
      status: "off-peak",
    });
  });

  it("em Hoje usa o dia corrente e marca pico na hora atual", async () => {
    report.mockResolvedValue([
      row(["14", "desktop", "janela_0"], 10),
      row(["11", "desktop", "janela_1"], 500),
    ]);

    await expect(getPeakUsage("SGP", "hoje")).resolves.toMatchObject({
      peakHour: 14,
      status: "peak",
    });
  });

  it("em Hoje cai para o dia anterior quando o dia corrente não tem dados", async () => {
    report.mockResolvedValue([row(["11", "tablet", "janela_1"], 7)]);

    const horas = await getPeakHours("SGP", "hoje");

    expect(horas.peakHour).toBe("11h");
    expect(horas.data[11].tablet).toBe(7);
  });
});

describe("getDeviceDistribution", () => {
  it("calcula o percentual por dispositivo no período", async () => {
    report.mockResolvedValueOnce([
      row(["desktop"], 80),
      row(["mobile"], 15),
      row(["tablet"], 5),
      row(["(other)"], 40),
    ]);

    await expect(getDeviceDistribution("SGP", "7-dias")).resolves.toEqual({
      system: "SGP",
      desktop: 80,
      mobile: 15,
      tablet: 5,
      warning: null,
    });
  });

  it("em Hoje usa o tempo real e tolera ausência de dados", async () => {
    realtime.mockResolvedValueOnce([]);

    await expect(getDeviceDistribution("SGP", "hoje")).resolves.toMatchObject({
      desktop: 0,
      mobile: 0,
      tablet: 0,
    });
    expect(report).not.toHaveBeenCalled();
  });
});

describe("getUsersByPage", () => {
  it("traz as páginas mais acessadas com a média dos períodos anteriores", async () => {
    report
      .mockResolvedValueOnce([row(["/login"], 90), row(["/nova"], 10)])
      .mockResolvedValueOnce([
        row(["/login", "janela_1"], 60),
        row(["/login", "janela_2"], 30),
        row(["/login", "janela_3"], 30),
      ]);

    await expect(getUsersByPage("SGP", "7-dias")).resolves.toEqual({
      system: "SGP",
      pages: [
        { path: "/login", currentUsers: 90, averageUsers: 40 },
        { path: "/nova", currentUsers: 10, averageUsers: 0 },
      ],
    });
    expect(report.mock.calls[1][1].dimensionFilter).toEqual({
      filter: { fieldName: "pagePath", inListFilter: { values: ["/login", "/nova"] } },
    });
  });

  it("devolve lista vazia sem consultar a referência quando não há acessos", async () => {
    report.mockResolvedValueOnce([]);

    await expect(getUsersByPage("SGP", "hoje")).resolves.toEqual({ system: "SGP", pages: [] });
    expect(report).toHaveBeenCalledTimes(1);
  });
});
