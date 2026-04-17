"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useAverageSession } from "@/hooks/useAverageSession";
import type { MetricTrend } from "@/types/metric";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const TREND_LABEL: Record<MetricTrend, string> = {
  "on-average": "Na média",
  above: "Acima da média",
  below: "Abaixo da média",
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export default function AverageSessionCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAverageSession({
    systemName: systemName ?? "",
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
      trendLabel={data ? TREND_LABEL[data.trend] : undefined}
      comparison={data ? `média: ${formatDuration(data.averageSeconds)}` : undefined}
      className={className}
    />
  );
}
