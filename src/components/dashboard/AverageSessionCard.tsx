"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useAverageSession } from "@/hooks/useAverageSession";
import type { MetricTrend } from "@/types/metric";
import type { AnalyticsPeriod } from "@/types/analyticsPeriod";

type Props = {
  readonly systemName?: string;
  readonly period?: AnalyticsPeriod;
  readonly className?: string;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function buildTrendLabel(
  trend: MetricTrend,
  currentSeconds: number,
  averageSeconds: number
): string {
  if (trend === "on-average") return "Na média";
  const percentage = Math.round(
    Math.abs((currentSeconds - averageSeconds) / averageSeconds) * 100
  );
  const suffix = trend === "above" ? "acima da média" : "abaixo da média";
  return `${percentage}% ${suffix}`;
}

export default function AverageSessionCard({ systemName, period, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAverageSession({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricCard
      title="Média de sessão"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar a média de sessão."
      value={data ? formatDuration(data.currentSeconds) : undefined}
      trend={data?.trend}
      trendLabel={
        data
          ? buildTrendLabel(data.trend, data.currentSeconds, data.averageSeconds)
          : undefined
      }
      comparison={data ? `média: ${formatDuration(data.averageSeconds)}` : undefined}
      className={className}
    />
  );
}
