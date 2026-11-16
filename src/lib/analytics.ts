import type { AnalyticsPeriod } from "@/types/analyticsPeriod";

export async function fetchAnalytics<T>(
  indicador: string,
  systemName: string,
  period: AnalyticsPeriod,
): Promise<T> {
  const qs = new URLSearchParams({ systemName, period });
  const res = await fetch(`/api/analytics/${indicador}?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Falha ao buscar dados do Google Analytics");
  return res.json();
}
