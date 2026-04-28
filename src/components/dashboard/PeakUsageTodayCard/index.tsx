"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { usePeakUsageToday } from "@/hooks/usePeakUsageToday";
import { PeakStatusBadge } from "./PeakStatusBadge";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

function formatPeakHour(hour: number) {
  return `${hour}h`;
}

export default function PeakUsageTodayCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = usePeakUsageToday({
    systemName: systemName ?? "",
  });

  return (
    <MetricCard
      title="Pico de uso hoje"
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
