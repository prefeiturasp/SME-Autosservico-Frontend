import "server-only";
import type { ActiveUsersResponse } from "@/types/activeUsers";
import type { AnalyticsPeriod } from "@/types/analyticsPeriod";
import type { AverageSessionResponse } from "@/types/averageSession";
import type { DeviceDistributionResponse } from "@/types/deviceDistribution";
import type { MetricTrend } from "@/types/metric";
import type { HourlyAccess, PeakHoursResponse } from "@/types/peakHours";
import type { PeakUsageTodayResponse } from "@/types/peakUsageToday";
import type { UsersByPageResponse } from "@/types/usersByPage";
import { runRealtimeReport, runReport, type GaRow } from "./client.server";

const DIAS_POR_PERIODO: Record<AnalyticsPeriod, number> = {
  hoje: 1,
  "7-dias": 7,
  "30-dias": 30,
};

const JANELAS_ANTERIORES = 3;
const TOLERANCIA_MEDIA_PERCENTUAL = 5;
const TOP_PAGINAS = 10;
const DISPOSITIVOS = ["desktop", "mobile", "tablet"] as const;

type DateRange = { startDate: string; endDate: string; name: string };

// Janela 0 é o período atual; as seguintes são os períodos anteriores de mesmo
// tamanho. "Hoje" inclui o dia corrente; 7 e 30 dias usam só dias completos.
function janela(period: AnalyticsPeriod, indice: number): DateRange {
  const dias = DIAS_POR_PERIODO[period];
  const fim = (period === "hoje" ? 0 : 1) + dias * indice;
  return {
    startDate: `${fim + dias - 1}daysAgo`,
    endDate: `${fim}daysAgo`,
    name: `janela_${indice}`,
  };
}

function janelasAnteriores(period: AnalyticsPeriod): DateRange[] {
  return Array.from({ length: JANELAS_ANTERIORES }, (_, i) => janela(period, i + 1));
}

const metric = (name: string) => ({ name });
const dimension = (name: string) => ({ name });

function media(valores: number[]): number {
  return valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
}

function compararComMedia(atual: number, mediaReferencia: number) {
  const diferenca = mediaReferencia
    ? ((atual - mediaReferencia) / mediaReferencia) * 100
    : 0;
  let trend: MetricTrend = "on-average";
  if (diferenca >= TOLERANCIA_MEDIA_PERCENTUAL) trend = "above";
  else if (diferenca <= -TOLERANCIA_MEDIA_PERCENTUAL) trend = "below";
  return { trend, differencePercentage: Math.round(Math.abs(diferenca)) };
}

function horaAtualEmSaoPaulo(): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date()),
  );
}

// Com mais de um dateRange o GA acrescenta o nome do intervalo como última dimensão.
function valorPorJanela(rows: GaRow[]): Map<string, number> {
  return new Map(rows.map((row) => [row.dimensions.at(-1) ?? "", row.metrics[0]]));
}

export async function getActiveUsers(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<ActiveUsersResponse> {
  let activeCount: number;
  let averageCount: number;

  if (period === "hoje") {
    // O relatório padrão do dia corrente chega com horas de atraso; "Hoje" usa
    // o tempo real (últimos 30 min) comparado à mesma hora do mesmo dia da
    // semana nas 3 semanas anteriores.
    const [agora, referencia] = await Promise.all([
      runRealtimeReport(systemName, { metrics: [metric("activeUsers")] }),
      runReport(systemName, {
        dateRanges: [7, 14, 21].map((dias) => ({
          startDate: `${dias}daysAgo`,
          endDate: `${dias}daysAgo`,
          name: `semana_${dias}`,
        })),
        metrics: [metric("activeUsers")],
        dimensionFilter: {
          filter: {
            fieldName: "hour",
            stringFilter: { value: String(horaAtualEmSaoPaulo()) },
          },
        },
      }),
    ]);
    activeCount = agora[0]?.metrics[0] ?? 0;
    averageCount = media(referencia.map((row) => row.metrics[0]));
  } else {
    const rows = await runReport(systemName, {
      dateRanges: [janela(period, 0), ...janelasAnteriores(period)],
      metrics: [metric("activeUsers")],
    });
    const porJanela = valorPorJanela(rows);
    activeCount = porJanela.get("janela_0") ?? 0;
    averageCount = media(
      janelasAnteriores(period).map((j) => porJanela.get(j.name) ?? 0),
    );
  }

  return {
    system: systemName,
    activeCount,
    averageCount: Math.round(averageCount),
    ...compararComMedia(activeCount, averageCount),
  };
}

export async function getAverageSession(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<AverageSessionResponse> {
  const anteriores = janelasAnteriores(period);
  const rows = await runReport(systemName, {
    dateRanges: [
      janela(period, 0),
      {
        startDate: anteriores[anteriores.length - 1].startDate,
        endDate: anteriores[0].endDate,
        name: "referencia",
      },
    ],
    metrics: [metric("averageSessionDuration")],
  });
  const porJanela = valorPorJanela(rows);
  const currentSeconds = Math.round(porJanela.get("janela_0") ?? 0);
  const averageSeconds = Math.round(porJanela.get("referencia") ?? 0);

  return {
    system: systemName,
    currentSeconds,
    averageSeconds,
    trend: compararComMedia(currentSeconds, averageSeconds).trend,
  };
}

function rotuloHora(hora: number): string {
  return `${String(hora).padStart(2, "0")}h`;
}

async function getAcessosPorHora(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<HourlyAccess[]> {
  // Em "Hoje" o dia corrente pode ainda não ter sido processado pelo GA (início
  // da manhã); nesse caso o gráfico cai para o dia anterior.
  const dateRanges =
    period === "hoje" ? [janela(period, 0), janela(period, 1)] : [janela(period, 0)];
  const rows = await runReport(systemName, {
    dateRanges,
    dimensions: [dimension("hour"), dimension("deviceCategory")],
    metrics: [metric("activeUsers")],
    limit: 1000,
  });

  const temJanelaAtual =
    dateRanges.length === 1 || rows.some((row) => row.dimensions[2] === "janela_0");
  const janelaUsada = temJanelaAtual ? "janela_0" : "janela_1";

  const horas: HourlyAccess[] = Array.from({ length: 24 }, (_, hora) => ({
    hour: rotuloHora(hora),
    desktop: 0,
    mobile: 0,
    tablet: 0,
    total: 0,
  }));

  for (const row of rows) {
    if (dateRanges.length > 1 && row.dimensions[2] !== janelaUsada) continue;
    const hora = Number(row.dimensions[0]);
    const dispositivo = DISPOSITIVOS.find((d) => d === row.dimensions[1]);
    // Linhas "(other)" (limite de cardinalidade do GA) não têm hora/dispositivo.
    if (!Number.isInteger(hora) || !dispositivo) continue;
    horas[hora][dispositivo] += row.metrics[0];
    horas[hora].total += row.metrics[0];
  }
  return horas;
}

function horaDePico(horas: HourlyAccess[]): number {
  return horas.reduce(
    (pico, entrada, hora) => (entrada.total > horas[pico].total ? hora : pico),
    0,
  );
}

export async function getPeakHours(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<PeakHoursResponse> {
  const data = await getAcessosPorHora(systemName, period);
  return { system: systemName, peakHour: rotuloHora(horaDePico(data)), data };
}

export async function getPeakUsage(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<PeakUsageTodayResponse> {
  const peakHour = horaDePico(await getAcessosPorHora(systemName, period));
  return {
    system: systemName,
    peakHour,
    status: horaAtualEmSaoPaulo() === peakHour ? "peak" : "off-peak",
  };
}

export async function getDeviceDistribution(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<DeviceDistributionResponse> {
  const body = {
    dimensions: [dimension("deviceCategory")],
    metrics: [metric("activeUsers")],
  };
  const rows =
    period === "hoje"
      ? await runRealtimeReport(systemName, body)
      : await runReport(systemName, { ...body, dateRanges: [janela(period, 0)] });

  const usuarios = (dispositivo: string) =>
    rows.find((row) => row.dimensions[0] === dispositivo)?.metrics[0] ?? 0;
  const total = DISPOSITIVOS.reduce((soma, d) => soma + usuarios(d), 0);
  const percentual = (dispositivo: string) =>
    total ? Math.round((usuarios(dispositivo) / total) * 100) : 0;

  return {
    system: systemName,
    desktop: percentual("desktop"),
    mobile: percentual("mobile"),
    tablet: percentual("tablet"),
    warning: null,
  };
}

export async function getUsersByPage(
  systemName: string,
  period: AnalyticsPeriod,
): Promise<UsersByPageResponse> {
  const base = {
    dimensions: [dimension("pagePath")],
    metrics: [metric("activeUsers")],
  };
  const atuais = await runReport(systemName, {
    ...base,
    dateRanges: [janela(period, 0)],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: TOP_PAGINAS,
  });
  if (atuais.length === 0) return { system: systemName, pages: [] };

  const anteriores = await runReport(systemName, {
    ...base,
    dateRanges: janelasAnteriores(period),
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        inListFilter: { values: atuais.map((row) => row.dimensions[0]) },
      },
    },
    limit: TOP_PAGINAS * JANELAS_ANTERIORES,
  });
  const somaAnterior = new Map<string, number>();
  for (const row of anteriores) {
    const path = row.dimensions[0];
    somaAnterior.set(path, (somaAnterior.get(path) ?? 0) + row.metrics[0]);
  }

  return {
    system: systemName,
    pages: atuais.map((row) => ({
      path: row.dimensions[0],
      currentUsers: row.metrics[0],
      averageUsers: Math.round(
        (somaAnterior.get(row.dimensions[0]) ?? 0) / JANELAS_ANTERIORES,
      ),
    })),
  };
}
