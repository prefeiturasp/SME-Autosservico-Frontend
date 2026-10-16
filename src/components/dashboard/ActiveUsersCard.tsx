"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import type { MetricTrend } from "@/types/metric";
import type { AnalyticsPeriod } from "@/types/analyticsPeriod";

type Props = {
  readonly systemName?: string;
  readonly period?: AnalyticsPeriod;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

function formatCount(value: number) {
  return ptBrFormatter.format(value);
}

function buildTrendLabel(trend: MetricTrend, percentage: number) {
  if (trend === "on-average") return "Na média";
  const suffix = trend === "above" ? "acima da média" : "abaixo da média";
  return `${percentage}% ${suffix}`;
}

export default function ActiveUsersCard({ systemName, period, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useActiveUsers({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricCard
      title="Usuários ativos"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os usuários ativos."
      value={data ? formatCount(data.activeCount) : undefined}
      trend={data?.trend}
      trendLabel={data ? buildTrendLabel(data.trend, data.differencePercentage) : undefined}
      comparison={data ? `média: ${formatCount(data.averageCount)}` : undefined}
      className={className}
    />
  );
}
