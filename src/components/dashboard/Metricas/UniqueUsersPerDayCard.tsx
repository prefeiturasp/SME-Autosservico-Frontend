"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useUniqueUsersPerDay } from "@/hooks/useUniqueUsersPerDay";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function UniqueUsersPerDayCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUniqueUsersPerDay({
    systemName: systemName ?? "",
  });

  return (
    <MetricCard
      title="Usuários únicos por dia"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os usuários únicos por dia."
      value={data ? ptBrFormatter.format(data.uniqueCount) : undefined}
      trend={data?.trend}
      trendLabel={data?.trendLabel}
      className={className}
    />
  );
}
