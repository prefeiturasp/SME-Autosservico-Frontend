import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AnalyticsNaoConfiguradoError } from "@/lib/googleAnalytics/client.server";
import {
  getActiveUsers,
  getAverageSession,
  getDeviceDistribution,
  getPeakHours,
  getPeakUsage,
  getUsersByPage,
} from "@/lib/googleAnalytics/indicadores.server";
import { ANALYTICS_PERIODS, type AnalyticsPeriod } from "@/types/analyticsPeriod";

export const runtime = "nodejs";
export const revalidate = 0;

const INDICADORES: Record<
  string,
  (systemName: string, period: AnalyticsPeriod) => Promise<unknown>
> = {
  "active-users": getActiveUsers,
  "average-session": getAverageSession,
  "peak-usage-today": getPeakUsage,
  "users-by-page": getUsersByPage,
  "device-distribution": getDeviceDistribution,
  "peak-hours": getPeakHours,
};

export async function GET(
  req: NextRequest,
  { params }: { params: { indicador: string } },
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const indicador = INDICADORES[params.indicador];
  if (!indicador) {
    return NextResponse.json({ error: "Indicador inválido" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const systemName = (searchParams.get("systemName") ?? "").trim();
  const period = (searchParams.get("period") ?? "").trim();

  if (!systemName) {
    return NextResponse.json({ error: "systemName é obrigatório" }, { status: 400 });
  }
  if (!ANALYTICS_PERIODS.some((p) => p.value === period)) {
    return NextResponse.json({ error: "period inválido" }, { status: 400 });
  }

  try {
    return NextResponse.json(await indicador(systemName, period as AnalyticsPeriod));
  } catch (e: unknown) {
    if (e instanceof AnalyticsNaoConfiguradoError) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    console.error("[analytics]", params.indicador, systemName, e);
    return NextResponse.json(
      { error: "Erro ao consultar o Google Analytics" },
      { status: 502 },
    );
  }
}
