"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useTodayAccessCount } from "@/hooks/useTodayAccessCount";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function TodayAccessCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useTodayAccessCount({
    systemName: systemName ?? "",
  });

  return (
    <MetricCard
      title="Total de acessos ao sistema hoje"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os acessos de hoje."
      value={data ? ptBrFormatter.format(data.accessCount) : undefined}
      trend={data?.trend}
      trendLabel={data?.trendLabel}
      className={className}
    />
  );
}
