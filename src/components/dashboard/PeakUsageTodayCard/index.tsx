"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { usePeakUsageToday } from "@/hooks/usePeakUsageToday";
import {
  DEFAULT_ANALYTICS_PERIOD,
  getPeakCardTitle,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";
import { PeakStatusBadge } from "./PeakStatusBadge";

type Props = {
  readonly systemName?: string;
  readonly period?: AnalyticsPeriod;
  readonly className?: string;
};

function formatPeakHour(hour: number) {
  return `${hour}h`;
}

export default function PeakUsageTodayCard({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = usePeakUsageToday({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricCard
      title={getPeakCardTitle(period)}
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o pico de uso."
      value={data ? formatPeakHour(data.peakHour) : undefined}
      badge={data ? <PeakStatusBadge status={data.status} /> : undefined}
      className={className}
    />
  );
}
